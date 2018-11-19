export const defaultCount = 0;

export default {
  computed: {
    count: {
      get() {
        return parseCount(this.$route.query.count);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            count: parseCount(value),
            after: void 0,
            before: void 0,
          }),
        );
      },
    },
  },
};

function parseCount(value) {
  value = parseInt(value) || defaultCount;
  return value;
}
