<template lang="pug">
  .posts-list
    PostEntry(
      v-for='post in posts.data.children'
      :post='post'
      :key='post.data.id'
    )
</template>

<script>
import PostEntry from '~/components/PostEntry';

export default {
  name: 'PostList',
  components: {
    PostEntry,
  },
  props: {
    posts: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
