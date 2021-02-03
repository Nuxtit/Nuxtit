export const key = 'is_self';

export default {
  computed: {
    [key]: {
      get() {
        return parse(this.$route.query[key]);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            [key]: parse(value),
          }),
        );
      },
    },
  },
};

function parse(value) {
  if (value === '1') return 'y';
  if (value === '0') return 'n';
  if (value === 'y') return 'y';
  if (value === 'n') return 'n';
  return null;
}
