<template lang="pug">
  span(v-text='timeago' :title='title')
</template>

<script>
import isNumber from 'lodash/isNumber';
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

const distanceInWordsToNowOptions = { addSuffix: true };

export default {
  name: 'TimeAgo',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    dateValue() {
      const { value } = this;
      if (value instanceof Date) {
        return value;
      }
      if (isNumber(value)) {
        return new Date(value * 1000);
      }
      return new Date(value);
    },
    timeago() {
      return distanceInWordsToNow(this.dateValue, distanceInWordsToNowOptions);
    },
    title() {
      const d = new Date(this.dateValue);
      return d.toLocaleString() + '\nISO8601: ' + d.toISOString();
    },
  },
};
</script>

<style></style>
