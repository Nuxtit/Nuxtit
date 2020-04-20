<template lang="pug">
  .container
    h2 queue
    Loading(v-if="fetching")
    template(v-else v-for="post in posts")
      TumblrPostForm(v-if="post.id === editingId" :post="post" :key="post.id")
      TumblrPostRow(v-else :post="post" :key="post.id")
    TumblrPagination(v-if="posts.length > 0" :items="posts")
</template>

<script>
import TumblrPostRow from '~/components/Tumblr/TumblrPostRow';
import TumblrPagination from '~/components/Tumblr/TumblrPagination';
import TumblrItems from '~/mixins/TumblrItems';

export default {
  middleware: ['auth'],
  components: {
    TumblrPostRow,
    TumblrPagination,
  },
  mixins: [TumblrItems('blogQueue')],
};
</script>
