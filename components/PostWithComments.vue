<template lang="pug">
  .post-comments-page
    PostEntry(:post='post')
    .post-body.container
      .card.card-block.bg-faded
        ItemHtml(:item='post')
    p
      .btn.btn-secondary(
        v-if='hasComments'
        @click.prevent.stop='$refs.comments.collapseAll(false)'
      )
        i.fa.fa-fw.btn-collapse.fa-plus
        | uncollapse all
      .btn.btn-secondary(
        v-if='hasComments'
        @click.prevent.stop='$refs.comments.collapseAll(true)'
      )
        i.fa.fa-fw.btn-collapse.fa-minus
        | collapse all


    CommentTree(:comments='comments', ref='comments')
</template>

<script>
import CommentCollection from '~/mixins/CommentCollection';
import CommentTree from '~/components/CommentTree.vue';
import ItemHtml from '~/components/ItemHtml';
import PostEntry from '~/components/PostEntry.vue';

export default {
  name: 'PostWithComments',
  components: {
    CommentTree,
    ItemHtml,
    PostEntry,
  },
  mixins: [CommentCollection],
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
    comments: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
