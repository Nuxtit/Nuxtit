<template lang="pug">
  span(v-text='humanNumber' :title='title')
</template>

<script>
import isNumber from 'lodash/isNumber';

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
    title() {
      const { upvote_ratio } = this.item.data;
      if (isNumber(upvote_ratio)) {
        return `${upvote_ratio * 100}%`;
      }
    },
  },
};
</script>

<style>
</style>
