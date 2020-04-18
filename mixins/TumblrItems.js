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
          this.posts = response.data.posts;
        } finally {
          this.fetching = false;
        }
      },
    },
  };
}
