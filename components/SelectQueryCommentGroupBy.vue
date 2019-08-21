<template lang="pug">
  div
    b-select(
      name='comment_group_by'
      :options='$options.selectOptions'
      v-model='comment_group_by'
    )
</template>

<script>
import QueryParamCommentGroupBy from '~/mixins/QueryParamCommentGroupBy';

export default {
  name: 'SelectQueryCommentGroupBy',
  mixins: [QueryParamCommentGroupBy],
  selectOptions: Object.freeze([
    { value: false, text: 'None' },
    { value: 'link_id', text: 'Link ID' },
  ]),
};
</script>

<style></style>
