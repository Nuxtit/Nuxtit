<template lang="pug">
  .post-duplicates-page
    PostEntry(:post='post')
    p
      nuxt-link.btn.btn-primary.pull-right(
        :to='`/r/${$route.params.subreddit}/comments/${$route.params.post_id}/${$route.params.post_title}`'
      )
        | comments
      nuxt-link.btn.btn-primary.pull-right(
        :to='`/pushshift/search?kind=posts&url=${post.data.url}`'
      )
        i.fa.fa-search.fa-fw
        | pushshift: other threads
      nuxt-link.btn.btn-primary.pull-right(
        v-if='youtubeId'
        :to='`/pushshift/search?kind=posts&url=${youtubeId}`'
      )
        i.fa.fa-search.fa-fw
        | pushshift: threads by youtubeId
    .post-duplicates
      h2 Duplicate Links:
      PostEntry(
        v-for='d in duplicates.data.children'
        :post='d'
        :key='d.data.id'
      )
</template>

<script>
import getYoutubeId from 'get-youtube-id';
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
  computed: {
    youtubeId() {
      const url = this.post && this.post.data && this.post.data.url;
      return (url && getYoutubeId(url)) || null;
    },
  },
};
</script>

<style></style>
