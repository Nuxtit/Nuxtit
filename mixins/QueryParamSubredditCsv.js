export default {
  computed: {
    subreddit: {
      get() {
        return this.$route.query.subreddit || '';
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            subreddit: value || void 0,
          }),
        );
      },
    },
  },
};
