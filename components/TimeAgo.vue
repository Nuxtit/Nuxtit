<template lang="pug">
  span(v-text='`${timeago} ago`' :title='title')
</template>

<script>
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

export default {
  name: 'TimeAgo',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    timeago() {
      return distanceInWordsToNow(new Date(this.value * 1000));
    },
    title() {
      const d = new Date(this.value * 1000);
      return d.toLocaleString() + '\nISO8601: ' + d.toISOString();
    },
  },
};
</script>

<style>
</style>
