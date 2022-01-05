<template lang="pug">
  PostWithComments(
    :subreddit='subreddit'
    :post='post'
    :comments='comments'
    @comment-created="onCommentCreated"
  )
</template>

<script>
import PostWithComments from '~/components/PostWithComments.vue';
import first from 'lodash/first';
import undata from '~/lib/undata';

export default {
  middleware: ['auth'],
  components: {
    PostWithComments,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
  async asyncData({ reddit, route }) {
    const { subreddit, post_id, comment_id } = route.params;
    const { context } = route.query;
    const [posts, comments] = (await reddit.get(
      `/r/${subreddit}/comments/${post_id}`,
      {
        params: {
          comment: comment_id,
          context: context || 3,
        },
      },
    )).data;

    return {
      post: undata(first(posts.data.children)),
      comments: undata(comments),
    };
  },
  methods: {
    onCommentCreated(newComment) {
      this.comments.children = [
        newComment,
        ...this.comments.children,
      ];
    },
  },
};
</script>

<style></style>
