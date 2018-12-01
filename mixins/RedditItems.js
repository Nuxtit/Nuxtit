import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { startMinWait } from '~/lib/sleep';
import QueryParamLimit, { defaultLimit } from '~/mixins/QueryParamLimit';

const defaultParams = Object.freeze({
  limit: defaultLimit,
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

  return {
    mixins: [QueryParamLimit],
    data() {
      return {
        fetching: false,
        items: null,
      };
    },
    computed: {
      showBottomPagination() {
        return get(this.items, 'data.children.length', 0) > 1;
      },
      redditQuery() {
        return query({ route: this.$route });
      },
      redditQueryJson() {
        return JSON.stringify(this.redditQuery);
      },
      zeroResults() {
        return !(get(this.items, 'data.children.length', 0) > 0);
      },
    },
    async asyncData({ reddit, route, store }) {
      if (shouldAttemptApi({ route })) {
        const items = (await reddit.get(path({ route }), {
          params: {
            ...defaultParams,
            ...query({ route }),
          },
        })).data;

        return {
          items,
        };
      } else {
        return emptyCollection();
      }
    },
    methods: {
      async fetchItems() {
        const route = this.$route;
        const store = this.$store;
        if (shouldAttemptApi({ route })) {
          const minWait = startMinWait();
          try {
            this.fetching = true;
            const items = (await this.$reddit.get(path({ route }), {
              params: {
                ...defaultParams,
                ...query({ route }),
              },
            })).data;

            this.items = items;
          } finally {
            await minWait;
            this.fetching = false;
          }
        }
      },
    },
    watch: {
      async redditQueryJson(newValue, oldValue) {
        if (newValue !== oldValue) {
          await this.fetchItems();
          window.scrollTo(0, 0);
        }
      },
    },
  };
}
