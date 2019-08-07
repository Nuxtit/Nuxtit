export default {
  computed: {
    domain: {
      get() {
        return this.$route.query.domain || '';
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            domain: value || void 0,
          }),
        );
      },
    },
  },
};
