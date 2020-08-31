<template lang="pug">
  .post-comments-page
    PostEntry(:post='post')
    .post-body.container(v-if='post.data.is_self')
      .card.card-block.bg-faded
        ItemHtml(:item='post')
    PostPoll(
      v-if="post.data.poll_data"
      :post='post'
    )
    p.alert.alert-danger(v-if='subreddit.data.user_is_banned')
      | You are banned from this subreddit.
    p.alert.alert-danger(v-if='post.data.locked')
      | Comments are locked.
    p
      .btn.btn-secondary(
        v-if='hasComments'
        @click.prevent.stop='$refs.comments.collapseAll(false)'
      )
        i.fa.fa-fw.fa-btn.btn-collapse.fa-plus
        | uncollapse all
      .btn.btn-secondary(
        v-if='hasComments'
        @click.prevent.stop='$refs.comments.collapseAll(true)'
      )
        i.fa.fa-fw.fa-btn.btn-collapse.fa-minus
        | collapse all
      nuxt-link.btn.btn-primary.pull-right(
        :to='`/r/${$route.params.subreddit}/duplicates/${$route.params.post_id}/${$route.params.post_title}`'
      )
        | duplicates

    CommentTree(:comments='comments', ref='comments')
</template>

<script>
import CommentCollection from '~/mixins/CommentCollection';
import CommentTree from '~/components/CommentTree.vue';
import ItemHtml from '~/components/ItemHtml';
import PostEntry from '~/components/PostEntry.vue';
import PostPoll from '~/components/PostPoll';

export default {
  name: 'PostWithComments',
  components: {
    CommentTree,
    ItemHtml,
    PostEntry,
    PostPoll,
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

<style></style>
