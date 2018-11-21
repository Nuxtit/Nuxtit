import includes from 'lodash/includes';
import SelectRedditSort from '~/components/SelectRedditSort.vue';

const validPostSorts = SelectRedditSort.sorts.map(s => s.value);

export default {
  validate({ route }) {
    if (route.params.sort) {
      return includes(validPostSorts, route.params.sort);
    }
    // the default should be valid
    return true;
  },
};
