<template lang="pug">
  div
    .form-group
      .form-check-inline
        b-form-checkbox(
          v-for="option in $options.kindOptions"
          v-model="kinds"
          :key="option.value"
          :value="option.value"
          :name="option.value"
        ) {{ option.text }}&nbsp;&#32;&nbsp;
</template>

<script>
import QueryParamKinds from '~/mixins/QueryParamKinds';
import { Kind } from '~/lib/enum';

export default {
  name: 'SelectQueryKinds',
  mixins: [QueryParamKinds],
  kindOptions: Object.freeze([
    { value: 'comment', text: 'Comment' },
    { value: 'post', text: 'Submission' },
    // { value: Kind.Subreddit, text: 'Subreddit' },
  ]),
};
</script>

<style>
</style>
