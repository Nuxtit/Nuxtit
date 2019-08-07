export default {
  computed: {
    authornegated: {
      get() {
        return !!this.$route.query.authornegated;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            authornegated: value ? 1 : void 0,
          }),
        );
      },
    },
  },
};
