<template lang="pug">
  nuxt-link(
    :to="`/user/${username}`"
    v-text="`/u/${username}`"
  )
</template>

<script>
export default {
  name: 'UserLink',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="sass">
.btn-upvote
  cursor: pointer
</style>
