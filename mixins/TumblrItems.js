export default function(apiCall) {
  return {
    props: {
      blog: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        editingId: null,
        fetching: false,
        posts: [],
      };
    },
    mounted() {
      this.fetchItems();
    },
    computed: {
      tumblrQuery() {
        return {
          name: this.$route.name,
          params: this.$route.params,
          query: this.$route.query,
        };
      },
      tumblrQueryJson() {
        return JSON.stringify(this.tumblrQuery);
      },
    },
    methods: {
      async fetchItems() {
        try {
          this.fetching = true;
          const response = await this.$store.dispatch('tumblr/apiCall', {
            apiCall,
            blogName: this.blog.name,
            options: {
              ...this.$route.query,
            },
          });
          if (response && response.data && response.data.posts) {
            this.posts = response.data.posts;
          } else {
            this.posts = [];
          }
        } finally {
          this.fetching = false;
        }
      },
    },
    watch: {
      async tumblrQueryJson(newValue, oldValue) {
        if (newValue !== oldValue) {
          await this.fetchItems();
          window.scrollTo(0, 0);
        }
      },
    },
  };
}
