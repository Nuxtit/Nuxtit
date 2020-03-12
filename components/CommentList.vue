<template lang="pug">
  .comments-list
    CommentEntry(
      v-for='comment in comments.data.children'
      v-show='!comment.nuxtitHide'
      :comment='comment'
      :key='comment.data.id'
    )
</template>

<script>
import CommentEntry from '~/components/CommentEntry';

export default {
  name: 'CommentList',
  components: {
    CommentEntry,
  },
  props: {
    comments: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
