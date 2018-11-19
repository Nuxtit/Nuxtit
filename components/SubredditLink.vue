<template lang="pug">
  nuxt-link(
    :class='classes'
    :to='`/r/${subreddit}`'
    v-text='`r/${subreddit}`'
  )
</template>

<script>
export default {
  name: 'SubredditLink',
  props: {
    subreddit: {
      type: String,
      required: true,
    },
  },
  computed: {
    classes() {
      return `srl-${this.subreddit}`;
    },
  },
};
</script>

<style lang="sass">
</style>
