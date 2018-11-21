<template lang="pug">
  PostWithDuplicates(
    :subreddit='subreddit'
    :post='post'
    :duplicates='duplicates'
  )
</template>

<script>
import PostWithDuplicates from '~/components/PostWithDuplicates.vue';
import first from 'lodash/first';

export default {
  middleware: ['auth'],
  components: {
    PostWithDuplicates,
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

    const post = first(posts.data.children);

    const duplicates = (await reddit.get(`/api/info`, {
      params: {
        url: post.data.url,
      },
    })).data;

    return {
      post,
      comments,
      duplicates,
    };
  },
};
</script>

<style>
</style>
