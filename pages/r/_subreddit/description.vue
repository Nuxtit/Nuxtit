<template lang="pug">
  SubredditDescription(:subreddit='subreddit')
</template>

<script>
import SubredditDescription from '~/components/SubredditDescription';

export default {
  middleware: ['auth'],
  components: {
    SubredditDescription,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
