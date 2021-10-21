<template lang="pug">
  .subreddits-list
    SubredditEntry(
      v-for='subreddit in subreddits.children'
      :subreddit='subreddit'
      :key='subreddit.id'
    )
</template>

<script>
import SubredditEntry from '~/components/SubredditEntry';

export default {
  name: 'SubredditList',
  components: {
    SubredditEntry,
  },
  props: {
    subreddits: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
