<template lang="pug">
   nuxt-child(:subreddit='subreddit')
</template>
<script>
export default {
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
