<template lang="pug">
  .posts-list
    PushshiftEntry(
      v-for='item in items.data.children'
      :item='item'
      :key='item.id'
    )
</template>

<script>
import PushshiftEntry from '~/components/PushshiftEntry';

export default {
  name: 'PushshiftList',
  components: {
    PushshiftEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
