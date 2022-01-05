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
    const { subreddit, post_id } = route.params;
    const [posts, comments] = (await reddit.get(
      `/r/${subreddit}/comments/${post_id}`,
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
