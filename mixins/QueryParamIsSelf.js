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
  if (value === '1') return '1';
  if (value === '0') return '0';
  return null;
}
