<template lang="pug">
  b-select(
    name="sort"
    v-model="selectedValue"
    :options="$options.sorts"
  )
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';

export default {
  name: 'SelectRedditSort',
  sorts: Object.freeze([
    { value: 'hot', text: 'Hot' },
    { value: 'new', text: 'New' },
    { value: 'rising', text: 'Rising' },
    { value: 'controversial', text: 'Controversial' },
    { value: 'top', text: 'Top' },
    { value: 'best', text: 'Best' },
    // { value: 'gilded', text: 'Gilded' },
  ]),
  computed: {
    selectedValue: {
      get() {
        const { sorts } = this.$options;
        const { sort } = this.$route.params;
        let option = find(sorts, o => sort === o.value);
        if (option) return option.value;
        let $parent = this.$parent;

        // had to write this spaghetti code because vue meta
        // dropped the meta
        while ($parent) {
          let option = find(
            sorts,
            o => $parent.$options.defaultSort === o.value,
          );
          if (option) return option.value;
          $parent = $parent.$parent;
        }
        return 'new';
      },
      set(value) {
        /* eslint-disable */
        const { $route, selectedValue } = this;

        if ($route.params.sort) {
          this.$router.push({
            ...$route,
            params: {
              ...$route.params,
              sort: value,
            },
          });
        } else if (this.$router.resolve({ name: `${$route.name}-sort` })) {
          this.$router.push({
            ...$route,
            params: {
              ...$route.params,
              sort: value,
            },
            name: `${$route.name}-sort`,
          });
        } else {
          throw new Error(`Failed to resolve route '${$route.name}-sort'`);
        }
      },
    },
  },
};
</script>

<style>
</style>
