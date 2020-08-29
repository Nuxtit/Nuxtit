<template lang="pug">
  b-select(
    name="state"
    v-model="selectedValue"
    :options="$options.selectables"
  )
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';

export default {
  name: 'SelectRedditModMailState',
  selectables: Object.freeze([
    { value: 'all', text: 'All' },
    { value: 'highlighted', text: 'Highlighted' },
    { value: 'notifications', text: 'Notifications' },
    { value: 'archived', text: 'Archived' },
    { value: 'appeals', text: 'Appeals' },
    { value: 'default', text: 'Default' },
    { value: 'new', text: 'New' },
    { value: 'inprogress', text: 'Inprogress' },
    { value: 'mod', text: 'Mod' },
  ]),
  computed: {
    selectedValue: {
      get() {
        const { selectables } = this.$options;
        const { state } = this.$route.query;
        let option = find(selectables, o => state === o.value);
        if (option) return option.value;
        return 'all';
      },
      set(value) {
        const { $route, selectedValue } = this;

        this.$router.push({
          ...$route,
          query: {
            ...$route.query,
            state: value,
          },
        });
      },
    },
  },
};
</script>

<style></style>
