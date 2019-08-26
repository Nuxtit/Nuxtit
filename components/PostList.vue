<template lang="pug">
  .posts-list
    PostEntry(
      v-for='post in postsChildren'
      :post='post'
      :key='post.data.id'
    )
</template>

<script>
import get from 'lodash/get';
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
  computed: {
    postsChildren() {
      return get(this, 'posts.data.children') || [];
    },
  },
};
</script>

<style></style>
