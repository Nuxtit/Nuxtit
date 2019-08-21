<template lang="pug">
  div
    b-select(
      name='kind'
      :options='$options.kindOptions'
      v-model='kind'
    )
</template>

<script>
import QueryParamKind from '~/mixins/QueryParamKind';
import { Kind } from '~/lib/enum';

export default {
  name: 'SelectQueryKind',
  mixins: [QueryParamKind],
  kindOptions: Object.freeze([
    { value: Kind.Comment, text: 'Comment' },
    { value: Kind.Post, text: 'Submission' },
    // { value: Kind.Subreddit, text: 'Subreddit' },
  ]),
};
</script>

<style></style>
