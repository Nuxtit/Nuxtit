export const defaultLimit = 25;

export default {
  computed: {
    post_group_by: {
      get() {
        return this.$route.query.post_group_by || false;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            post_group_by: value || void 0,
          }),
        );
      },
    },
  },
};
