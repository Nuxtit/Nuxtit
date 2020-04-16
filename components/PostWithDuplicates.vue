<template lang="pug">
  .post-duplicates-page
    PostEntry(:post='post')
    p
      nuxt-link.btn.btn-primary.pull-right(
        :to='`/r/${$route.params.subreddit}/comments/${$route.params.post_id}/${$route.params.post_title}`'
      )
        | comments
      nuxt-link.btn.btn-primary.pull-right(
        :to='`/pushshift/search?kind=t3&url=${post.data.url}`'
      )
        | pushshift: other threads
    .post-duplicates
      h2 Duplicate Links:
      PostEntry(
        v-for='d in duplicates.data.children'
        :post='d'
        :key='d.data.id'
      )
</template>

<script>
import ItemHtml from '~/components/ItemHtml';
import PostEntry from '~/components/PostEntry.vue';

export default {
  name: 'PostWithDuplicates',
  components: {
    ItemHtml,
    PostEntry,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
    duplicates: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
