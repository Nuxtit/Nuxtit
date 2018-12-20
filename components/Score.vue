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
      if (this.item.data.score_hidden) {
        return '?';
      }
      return this.item.data.score;
    },
    title() {
      if (this.item.data.score_hidden) {
        return 'score hidden';
      }
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
