export const defaultLimit = 25;

export default {
  computed: {
    limit: {
      get() {
        return parseLimit(this.$route.query.limit);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            limit: parseLimit(value),
          }),
        );
      },
    },
  },
};

function parseLimit(value) {
  value = parseInt(value) || defaultLimit;
  value = Math.min(1000, value);
  value = Math.max(1, value);
  return value;
}
