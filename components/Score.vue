<template lang="pug">
  span(v-text='humanNumber')
</template>

<script>
export default {
  name: 'Score',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    humanNumber() {
      return this.item.data.score;
    },
  },
};
</script>

<style>
</style>
