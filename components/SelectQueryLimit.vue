<template lang="pug">
  b-select(
    name='limit'
    :options='limitOptions'
    v-model='limit'
  )
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import QueryParamLimit from '~/mixins/QueryParamLimit';

export default {
  name: 'SelectQueryLimit',
  mixins: [QueryParamLimit],
  limitOptions: Object.freeze([
    // must reddit api calls only return 100
    // at least from the ones I actually use
    5, 15, 25, 50, 75, 100, // eslint-disable-line
    // pushshift allows more
    250, 500, // eslint-disable-line
  ]),
  props: {
    max: {
      type: Number,
      required: false,
      default() {
        return 100;
      },
    },
  },
  computed: {
    limitOptions() {
      return this.$options.limitOptions.filter(v => !(v > this.max));
    },
  },
};
</script>

<style>
</style>
