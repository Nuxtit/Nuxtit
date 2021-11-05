<template lang="pug">
  CommentEntry(
    v-if='item.kind === "t1"'
    :comment='item'
    :key='item.id'
  )
  PostEntry(
    v-else-if='item.kind === "t3"'
    :post='item'
    :key='item.id'
  )
  SubredditEntry(
    v-else-if='item.kind === "t5"'
    :subreddit='item'
    :key='item.id'
  )
  PushshiftMissingEntry(
    v-else-if="item.pushshiftMissing"
    :item='item'
    :key='item.id'
  )
  div.alert.alert-danger(
    v-else
    :key='item.id'
  )
    | Error: unsupported "kind" {{ item.kind }}
    | Error: unsupported "kind" {{ {item} }}
</template>

<script>
import get from 'lodash/get';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import PushshiftMissingEntry from '~/components/PushshiftMissingEntry';
import SubredditEntry from '~/components/SubredditEntry';

export default {
  name: 'MixedList',
  components: {
    CommentEntry,
    PostEntry,
    PushshiftMissingEntry,
    SubredditEntry,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
