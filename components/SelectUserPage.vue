<template lang="pug">
  b-select.select-user-page(
    name="sort"
    v-model="selectedValue"
    :options="$options.pages"
  )
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';

export default {
  name: 'SelectUserPage',
  pages: Object.freeze([
    { value: 'about', text: 'About' },
    { value: 'overview', text: 'Overview' },
    { value: 'submitted', text: 'Submitted' },
    { value: 'comments', text: 'Comments' },
    // @todo how to detetch if these are available?
    // { value: 'upvoted', text: 'Upvoted' },
    // { value: 'downvoted', text: 'Downvoted' },
    // { value: 'saved', text: 'Saved' },
    // { value: 'hidden', text: 'Hidden' },
    { value: 'gilded', text: 'Gilded' },
  ]),
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    selectedValue: {
      get() {
        const { pages } = this.$options;
        const { name } = this.$route;
        let page = find(pages, p =>
          name.startsWith(`user-username-${p.value}`),
        );
        if (page) return page.value;

        return 'overview';
      },
      set(value) {
        /* eslint-disable */
        const { $route, selectedValue } = this;
        this.$router.push(`/user/${this.user.data.name}/${value}`);
        // console.error('not-resolved!');
      },
    },
  },
};
</script>

<style lang="sass">
.select-user-page
  max-width: 10rem
</style>
