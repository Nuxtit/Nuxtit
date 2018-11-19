import includes from 'lodash/includes';

const truthyQueryStrings = ['1', 'true', 'yes'];

export default {
  computed: {
    selftext: {
      get() {
        return includes(truthyQueryStrings, this.$route.query.selftext);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            selftext: value ? 'true' : void 0,
          }),
        );
      },
    },
  },
};
