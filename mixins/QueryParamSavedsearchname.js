export default {
  computed: {
    name: {
      get() {
        return this.$route.query.name || '';
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            name: value || void 0,
          }),
        );
      },
    },
  },
};
