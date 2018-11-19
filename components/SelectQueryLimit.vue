<template lang="pug">
  b-select(
    name='limit'
    :options='$options.limitOptions'
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
  limitOptions: Object.freeze([5, 15, 25, 50, 75, 100]),
};
</script>

<style>
</style>
