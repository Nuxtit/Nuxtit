export default {
  computed: {
    domainnegated: {
      get() {
        return !!this.$route.query.domainnegated;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            domainnegated: value ? 1 : void 0,
          }),
        );
      },
    },
  },
};
