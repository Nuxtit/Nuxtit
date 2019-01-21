import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import includes from 'lodash/includes';
import isFunction from 'lodash/isFunction';
import { Kind } from '~/lib/enum';
import { startMinWait } from '~/lib/sleep';
import pushshift from '~/lib/pushshift';
import QueryParamLimit, { defaultLimit } from '~/mixins/QueryParamLimit';
import QueryParamKind, { parseKind } from '~/mixins/QueryParamKind';
import Vue from 'vue';

const defaultParams = Object.freeze({
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

export default function({ path, query, shouldAttemptApi }) {
  if (!isFunction(shouldAttemptApi)) {
    shouldAttemptApi = returnTrue;
  }
  if (!isFunction(path)) {
    path = ({ route }) => {
      console.log('path.kind', parseKind(route.query.kind));
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
        q: route.query.q || void 0,
      };

      if (kind === Kind.Post || kind === Kind.Comment) {
        params.subreddit = route.query.subreddit || void 0;
      }
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
        return get(this.items, 'data.children.length', 0) > 1;
      },
      redditQuery() {
        return query({
          route: this.$route,
          kind: this.kind,
        });
      },
      redditQueryJson() {
        return JSON.stringify(this.redditQuery) + this.kind;
      },
      zeroResults() {
        return !(get(this.items, 'data.children.length', 0) > 0);
      },
    },
    async asyncData({ reddit, route, store }) {
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

        if (!get(this.items, 'data.children.length')) {
          return;
        }
        for (let i = this.items.data.children.length - 1, item; i >= 0; i--) {
          item = this.items.data.children[i];
          this.$set(item, 'redusaHide', !isMatch(item));
        }

        function isMatch({ kind, data }) {
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
  const response = await reddit.get('/api/info', {
    params: {
      id:  input.map(entry => `${kind}_${entry.id}`).join(','),
      // url
    },
  });
  console.log({ response });
  const redditChildren = get(response, 'data.data.children');
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
    },
  };
}
