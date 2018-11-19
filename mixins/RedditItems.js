import get from 'lodash/get';
import { startMinWait } from '~/lib/sleep';
import QueryParamLimit, { defaultLimit } from '~/mixins/QueryParamLimit';

const defaultParams = Object.freeze({
  limit: defaultLimit,
});

export default function({ path, query }) {
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
    },
    async asyncData({ reddit, route }) {
      return {
        items: (await reddit.get(path({ route }), {
          params: {
            ...defaultParams,
            ...query({ route }),
          },
        })).data,
      };
    },
    methods: {
      async fetchItems() {
        const minWait = startMinWait();
        try {
          this.fetching = true;
          const route = this.$route;
          this.items = (await this.$reddit.get(path({ route }), {
            params: {
              ...defaultParams,
              ...query({ route }),
            },
          })).data;
        } finally {
          await minWait;
          this.fetching = false;
        }
      },
    },
    watch: {
      redditQueryJson(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.fetchItems();
        }
      },
    },
  };
}
