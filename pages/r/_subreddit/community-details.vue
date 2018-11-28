<template lang="pug">
  CommunityDetails(:subreddit='subreddit')
</template>

<script>
import CommunityDetails from '~/components/CommunityDetails';

export default {
  middleware: ['auth'],
  components: {
    CommunityDetails,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
