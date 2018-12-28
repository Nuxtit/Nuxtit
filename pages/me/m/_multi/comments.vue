<template lang="pug">
   nuxt-child(:subreddit='subreddit')
</template>
<script>
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
