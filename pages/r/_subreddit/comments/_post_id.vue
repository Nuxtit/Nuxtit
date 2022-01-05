<template lang="pug">
   nuxt-child(:subreddit='subreddit')
</template>

<script>
import PostWithComments from '~/components/PostWithComments.vue';

export default {
  middleware: ['auth'],
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
