<template lang="pug">
  div
    b-form-input(
      :name='path'
      :placeholder='placeholder===null ? path : placeholder'
      v-model='value'
    )
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';

export default {
  name: 'SelectQueryText',
  props: {
    path: {
      required: true,
      type: String,
    },
    placeholder: {
      type: String,
      default() {
        return null;
      },
    },
  },
  computed: {
    value: {
      get() {
        return get(this.$route.query, this.path, '');
      },
      set(value) {
        const query = {
          ...this.$route.query,
        };
        set(query, this.path, value);
        this.$router.push(this.$mergeRouteQuery(query));
      },
    },
  },
};
</script>

<style>
</style>
