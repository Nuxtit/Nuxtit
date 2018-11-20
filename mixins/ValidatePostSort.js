import includes from 'lodash/includes';
import SelectRedditSort from '~/components/SelectRedditSort.vue';

const validPostSorts = SelectRedditSort.sorts.map(s => s.value);

export default {
  validate({ route }) {
    return includes(validPostSorts, route.params.sort);
  },
};
