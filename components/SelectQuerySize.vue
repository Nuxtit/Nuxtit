<template lang="pug">
  b-select(
    name='size'
    :options='sizeOptions'
    v-model='size'
  )
</template>

<script>
import QueryParamSize from '~/mixins/QueryParamSize';

export default {
  name: 'SelectQuerySize',
  mixins: [QueryParamSize],
  sizeOptions: Object.freeze([
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
    sizeOptions() {
      return this.$options.sizeOptions.filter(v => !(v > this.max));
    },
  },
};
</script>

<style></style>
