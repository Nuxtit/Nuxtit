export const defaultSize = 25;

export default {
  computed: {
    size: {
      get() {
        return parseSize(this.$route.query.size);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            size: parseSize(value),
          }),
        );
      },
    },
  },
};

function parseSize(value) {
  value = parseInt(value) || defaultSize;
  value = Math.min(1000, value);
  value = Math.max(1, value);
  return value;
}
