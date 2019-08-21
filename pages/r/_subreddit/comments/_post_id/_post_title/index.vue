<template lang="pug">
  PostWithComments(
    :subreddit='subreddit'
    :post='post'
    :comments='comments'
  )
</template>

<script>
import PostWithComments from '~/components/PostWithComments.vue';
import first from 'lodash/first';

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
      post: first(posts.data.children),
      comments,
    };
  },
};
</script>

<style></style>
