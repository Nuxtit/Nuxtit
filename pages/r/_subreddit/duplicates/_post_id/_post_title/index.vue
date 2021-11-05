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
import undata from '~/lib/undata';

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

    // const post = undata(first(posts.data.children));

    const post_res = await reddit.get(`/api/info`, {
      params: {
        id: `t3_${post_id}`,
      },
    });

    const post = undata(post_res.data.data.children[0]);

    // /api/duplicates/${article} exists, but IDK how to call it correctly
    let duplicates = (await reddit.get(`/api/info`, {
      params: {
        url: post.url,
      },
    })).data;
    duplicates = undata(duplicates);
    duplicates.children = duplicates.children.filter(d => d.id !== post_id);

    return {
      post,
      duplicates,
    };
  },
};
</script>

<style></style>
