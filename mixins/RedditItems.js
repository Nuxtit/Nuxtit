import get from 'lodash/get';
import includes from 'lodash/includes';
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
        filterOptions: { text: '' },
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
      // console.log('asyncData');
      if (shouldAttemptApi({ route })) {
        const items = (await reddit
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
          })).data;

        // console.log('asyncData');
        return {
          items,
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
          this.$set(item, 'nuxtitHide', !isMatch(item));
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
      async redditQueryJson(newValue, oldValue) {
        if (newValue !== oldValue) {
          await this.fetchItems();
          window.scrollTo(0, 0);
        }
      },
    },
  };
}
