import chunk from 'lodash/chunk';
import get from 'lodash/get';
import find from 'lodash/find';
import last from 'lodash/last';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import includes from 'lodash/includes';
import isFunction from 'lodash/isFunction';
import uniq from 'lodash/uniq';
import { Kind } from '~/lib/enum';
import { startMinWait } from '~/lib/sleep';
import pushshift from '~/lib/pushshift';
import QueryParamLimit, { defaultLimit } from '~/mixins/QueryParamLimit';
import QueryParamKind, { parseKind } from '~/mixins/QueryParamKind';
import Vue from 'vue';
import undata from '~/lib/undata';

const defaultParams = Object.freeze({
  size: 25,
  // limit: 25,
  // pretty: false,
  sort: 'desc',
  // sort_type: 'new',
});

function returnTrue() {
  return true;
}

function emptyCollection() {
  return {
    data: {
      children: [],
    },
  };
}

function negateList(csv) {
  return csv
    .split(',')
    .map(name => `!${name}`)
    .join(',');
}

// you can put these in the URL yourself,
// if there is not a GUI component,
// also pushshift does not support all of these
// so maybe in the future we'll apply this client-side,
// maybe pre-collapse them
const yn_to_bools = [
  'is_video',
  'is_self',
  'is_gallery',
  'is_meta',
  'quarantine',
  'is_original_content',
  'is_reddit_media_domain',
  'is_created_from_ads_ui',
  'author_premium',
  'edited',
  'allow_live_comments',
  'is_crosspostable',
  'over_18',
  'stickied',
  'pinned',
  'media_only',
];

// things that would be cool to filter by:
// subreddit_subscribers > 100
// num_crossposts > 0
// num_comments > 0
// score > 0
// ups > 0
// downs > 0
// upvote_ratio > 0
// gilded > 0
// discussion_type = ??

export default function({ path, query, shouldAttemptApi }) {
  if (!isFunction(shouldAttemptApi)) {
    shouldAttemptApi = returnTrue;
  }
  if (!isFunction(path)) {
    path = ({ route }) => {
      // console.log('path.kind', parseKind(route.query.kind));
      const resource = {
        [Kind.Comment]: 'comment',
        [Kind.Post]: 'submission',
        [Kind.Subreddit]: 'subreddit',
      }[parseKind(route.query.kind)];
      return `/reddit/search/${resource}`;
    };
  }
  if (!isFunction(query)) {
    query = ({ route }) => {
      const kind = parseKind(route.query.kind);
      // const sort_type = route.query.sort_type || 'new';

      const params = {
        ...route.query,
        kind,
      };

      if (params.subreddit && route.query.subredditnegated) {
        params.subreddit = negateList(params.subreddit);
      }
      if (params.author && route.query.authornegated) {
        params.author = negateList(params.author);
      }
      if (params.domain && route.query.domainnegated) {
        params.domain = negateList(params.domain);
      }

      yn_to_bools.forEach(key => {
        if (params[key] === 'y' || params[key] === '1') {
          params[key] = true;
        } else if (params[key] === 'n' || params[key] === '0') {
          params[key] = false;
        }
      });
      return params;
    };
  }

  return {
    mixins: [QueryParamLimit, QueryParamKind],
    data() {
      return {
        fetching: false,
        items: null,
        filterOptions: { text: '' },
      };
    },
    computed: {
      showBottomPagination() {
        return get(this.items, 'children.length', 0) > 1;
      },
      redditQuery() {
        return query({
          route: this.$route,
        });
      },
      redditQueryJson() {
        return JSON.stringify(this.redditQuery) + this.kind;
      },
      zeroResults() {
        return !(get(this.items, 'children.length', 0) > 0);
      },
      lastCreatedAt() {
        const lastCreatedAt = get(
          last(get(this.items, 'children')),
          'created_utc',
        );
        return lastCreatedAt || null;
      },
    },
    async asyncData({ reddit, route, store }) {
      // the user must now manually press the search button to start a query
      // I don't like it querying an unfiltered search
      // before I've selected my saved search
      return emptyCollection();
      /*
      // console.log('asyncData');
      if (shouldAttemptApi({ route })) {
        const items = (await pushshift
          .get(path({ route }), {
            params: {
              ...defaultParams,
              ...query({ route }),
            },
          })
          .catch(err => {
            if (err.message === 'Network Error') {
              return { data: emptyCollection() };
            }
            throw err;
          })).data.data;

        // console.log('asyncData');
        return {
          items: await pushshiftItemsToRedditItems({
            reddit,
            input: items,
            route,
          }),
        };
      } else {
        return emptyCollection();
      }
      */
    },
    methods: {
      async fetchItems() {
        // console.log(this.$options.name, 'fetchItems');
        const route = this.$route;
        const store = this.$store;
        const reddit = this.$reddit;
        if (shouldAttemptApi({ route })) {
          const minWait = startMinWait();
          try {
            this.fetching = true;
            const items = (await pushshift.get(path({ route }), {
              params: {
                ...defaultParams,
                ...query({ route }),
              },
            })).data.data;

            this.items = await pushshiftItemsToRedditItems({
              reddit,
              input: items,
              route,
            });
            this.setItemsFilteredProperty();
          } finally {
            await minWait;
            this.fetching = false;
          }
        }
      },
      setItemsFilteredProperty() {
        const { text } = this.filterOptions;
        const lc_text = (text || '').toLowerCase();

        if (!get(this.items, 'children.length')) {
          return;
        }
        for (let i = this.items.children.length - 1, item; i >= 0; i--) {
          item = this.items.children[i];
          this.$set(item, 'nuxtitHide', !isMatch(item));
        }

        function isMatch({ kind, body }) {
          if (lc_text) {
            const lc_body = (body || '').toLowerCase();
            if (includes(lc_body, lc_text)) {
              return true;
            }
            return false;
          }
          return true;
        }
      },
      async nextPage() {
        await this.$router.push(
          this.$mergeRouteQuery({
            before: this.lastCreatedAt + 1,
          }),
        );
        await this.$nextTick();
        await this.$nextTick();
        await this.fetchItems();
        window.scrollTo(0, 400);
      },
    },
    watch: {
      filterOptions: {
        deep: true,
        immediate: true,
        handler: 'setItemsFilteredProperty',
      },
      // async redditQueryJson(newValue, oldValue) {
      //   console.log('redditQueryJson', { newValue, oldValue });
      //   if (newValue !== oldValue) {
      //     await this.fetchItems();
      //     window.scrollTo(0, 0);
      //   }
      // },
    },
  };
}

async function pushshiftItemsToRedditItems({ reddit, input, route }) {
  const kind = parseKind(route.query.kind);
  /* eslint-disable */

  // this api call only acepts 100;
  const chunks = chunk(uniq([
    // get fullnames whether these are posts or comments
    ...input.map(entry => `${kind}_${entry.id}`),
    // get links, if these are comments
    ...input.map(item => item.link_id).filter(Boolean),
  ]), 100);
  let responses = [];
  for (let i = 0; i < chunks.length; i++) {
    responses.push(await reddit.get('/api/info', {
      params: {
        id:  chunks[i].join(','),
        // url
      },
    }))
  }
  const redditChildren = map(flatten(
    responses.map(response => get(response, 'data.data.children')),
  ), undata);
  // console.log({ redditChildren });
  const children = map(input, (item) => {
    const redditItem = find(redditChildren, redditItem => {
      return redditItem.id === item.id;
    });
    const redditLink = item.link_id ? find(redditChildren, redditItem => {
      return item.link_id === Kind.Post+'_'+redditItem.id;
    }) : null;
    if (redditItem) {
      redditItem.postEntry = redditLink || void 0;
      return {
        pushshiftEntry: item,
        ...redditItem,
      };
    }
    item.kind = item.kind || kind;
    item.postEntry = redditLink || void 0;
    item.pushshiftMissing = true;
    return item;
    // return {
    //   kind,
    //   ...item,
    //   postEntry: redditLink || void 0,
    //   pushshiftMissing: true,
    // };
  });
  return {
    kind: 'Listing',
    children,
  };
}
