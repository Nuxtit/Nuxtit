<template lang="pug">
  span(v-text='text' :title='title')
</template>

<script>
import isNumber from 'lodash/isNumber';
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

export default {
  name: 'DateTime',
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
    title() {
      return distanceInWordsToNow(this.dateValue) + ' ago';
    },
    text() {
      const d = new Date(this.dateValue);
      return d.toLocaleString();
    },
  },
};
</script>

<style>
</style>
