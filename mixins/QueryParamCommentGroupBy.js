export default {
  computed: {
    comment_group_by: {
      get() {
        return this.$route.query.comment_group_by || false;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            comment_group_by: value || void 0,
          }),
        );
      },
    },
  },
};
