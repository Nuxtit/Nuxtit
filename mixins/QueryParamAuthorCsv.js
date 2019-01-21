export default {
  computed: {
    author: {
      get() {
        return this.$route.query.author || '';
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            author: value || void 0,
          }),
        );
      },
    },
  },
};
