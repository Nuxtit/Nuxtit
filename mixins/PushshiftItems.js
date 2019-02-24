import chunk from 'lodash/chunk';
import get from 'lodash/get';
import find from 'lodash/find';
import last from 'lodash/last';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import includes from 'lodash/includes';
import isFunction from 'lodash/isFunction';
import orderBy from 'lodash/orderBy';
import { Kind } from '~/lib/enum';
import { applyBadActorScan } from '~/lib/applyBadActorScan';
import { startMinWait } from '~/lib/sleep';
import pushshift from '~/lib/pushshift';
import QueryParamLimit, { defaultLimit } from '~/mixins/QueryParamLimit';
import QueryParamKinds, {
  parseKinds,
  parseKind,
} from '~/mixins/QueryParamKinds';
import Vue from 'vue';

const fieldsByKind = {
  comment: 'created_utc,author,id,parent_id,link_id,selftext',
  submission: 'created_utc,author,body,id,parent_id,selftext,title,url',
};

const defaultParams = Object.freeze({
  size: 25,
  // limit: 25,
  // pretty: false,
  sort: 'desc',
  // sort_type: 'new',
  // fields: 'created_utc,author,body,id,parent_id,link_id,selftext,title,url',
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

export default function({ path, query, shouldAttemptApi }) {
  if (!isFunction(shouldAttemptApi)) {
    shouldAttemptApi = returnTrue;
  }
  if (!isFunction(path)) {
    path = ({ route, kind }) => {
      console.log('path.kind', kind);
      const resource =
        {
          [Kind.Comment]: 'comment',
          [Kind.Post]: 'submission',
          [Kind.Subreddit]: 'subreddit',
          post: 'submission',
        }[parseKinds(kind || route.query.kind)] ||
        kind ||
        route.query.kind;
      console.log('path.resource', resource);
      return `/reddit/search/${resource}`;
    };
  }
  if (!isFunction(query)) {
    query = ({ route }) => {
      const kinds = parseKinds(route.query.kinds);
      // const sort_type = route.query.sort_type || 'new';

      const params = {
        q: route.query.q || void 0,
        size: route.query.size || void 0,
        before: route.query.before || void 0,
        after: route.query.after || void 0,
      };

      params.subreddit = route.query.subreddit || void 0;
      params.author = route.query.author || void 0;
      return params;
    };
  }

  return {
    mixins: [QueryParamLimit, QueryParamKinds],
    data() {
      return {
        fetching: false,
        items: null,
        filterOptions: { text: '' },
      };
    },
    computed: {
      showBottomPagination() {
        return get(this.items, 'data.children.length', 0) > 1;
      },
      redditQuery() {
        return query({
          route: this.$route,
        });
      },
      redditQueryJson() {
        return JSON.stringify(this.redditQuery) + JSON.stringify(this.kinds);
      },
      zeroResults() {
        return !(get(this.items, 'data.children.length', 0) > 0);
      },
      lastCreatedAt() {
        const lastCreatedAt = get(
          last(get(this.items, 'data.children')),
          'data.created_utc',
        );
        return lastCreatedAt || null;
      },
    },
    async asyncData({ reddit, route, store }) {
      // console.log('asyncData');
      if (shouldAttemptApi({ route })) {
        let items = parseKinds(route.query.kinds);
        items = items.map(async kind => {
          try {
            console.log(path({ route, kind }));
            const response = await pushshift.get(path({ route, kind }), {
              params: {
                ...defaultParams,
                ...query({ route }),
                fields: fieldsByKind[kind],
              },
            });
            forEach(response.data.data, item => {
              item.kind = parseKind(kind);
            });
            return response.data.data;
          } catch (err) {
            if (err.message === 'Network Error') {
              return { data: emptyCollection() };
            }
            throw err;
          }
        });
        items = await Promise.all(items);

        // console.log('asyncData');
        return {
          items: await pushshiftItemsToRedditItems({
            reddit,
            input: orderBy(flatten(items), ['created_utc'], ['desc']),
            route,
          }),
        };
      } else {
        return emptyCollection();
      }
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
            const items = (await pushshift.get(path({ route, kind }), {
              params: {
                ...defaultParams,
                ...query({ route }),
              },
            })).data.data;

            this.items = await pushshiftItemsToRedditItems({
              reddit,
              input: items,
              route,
              kind,
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

        if (!get(this.items, 'data.children.length')) {
          return;
        }
        for (let i = this.items.data.children.length - 1, item; i >= 0; i--) {
          item = this.items.data.children[i];
          this.$set(item, 'redusaHide', !isMatch(item));
        }

        function isMatch({ kinds, data }) {
          if (lc_text) {
            const lc_body = (data.body || '').toLowerCase();
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
  /* eslint-disable */

  let badActors = null;
  console.log('applyBadActorScan', route.query.post_group_by === 'bad_actor', route.query.post_group_by);
  if (route.query.post_group_by === 'bad_actor') {
    badActors = await applyBadActorScan(input);
  }

  // this api call only acepts 100;
  const chunks = chunk(input, 100);
  let responses = [];
  for (let i = 0; i < chunks.length; i++) {
    responses.push(await reddit.get('/api/info', {
      params: {
        id:  chunks[i].map(entry => `${entry.kind}_${entry.id}`).join(','),
        // url
      },
    }))
  }
  const redditChildren = flatten(
    responses.map(response => get(response, 'data.data.children')),
  );
  console.log({ redditChildren });
  const children = map(input, (item) => {
    const redditItem = find(redditChildren, redditItem => {
      return redditItem.data.id === item.id;
    });
    if (redditItem) {
      redditItem.pushshiftEntry = item;
      return redditItem;
    }
    return {
      kind,
      data: {
        ...item,
      },
      pushshiftMissing: true,
    };
  });
  return {
    data: {
      children,
      badActors,
    },
  };
}
