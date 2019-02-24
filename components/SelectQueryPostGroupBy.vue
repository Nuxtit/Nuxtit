<template lang="pug">
  div
    b-select(
      name='post_group_by'
      :options='$options.selectOptions'
      v-model='post_group_by'
    )
</template>

<script>
import QueryParamPostGroupBy from '~/mixins/QueryParamPostGroupBy';

export default {
  name: 'SelectQueryPostGroupBy',
  mixins: [QueryParamPostGroupBy],
  selectOptions: Object.freeze([
    { value: false, text: 'List' },
    { value: 'link_url', text: 'Group By Link URL' },
    { value: 'bad_actor', text: 'Bad Actor Scan' },
  ]),
};
</script>

<style>
</style>
