<template lang="pug">
  div
    b-form-input(
      name='author'
      v-model='author'
    )
</template>

<script>
import QueryParamAuthorCsv from '~/mixins/QueryParamAuthorCsv';

export default {
  name: 'SelectQueryAuthorCsv',
  mixins: [QueryParamAuthorCsv],
};
</script>

<style>
</style>
