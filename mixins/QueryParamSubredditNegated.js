export default {
  computed: {
    subredditnegated: {
      get() {
        return !!this.$route.query.subredditnegated;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            subredditnegated: value ? 1 : void 0,
          }),
        );
      },
    },
  },
};
