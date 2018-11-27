<template lang="pug">
  b-badge(
    v-if='masstaggerSubs'
    v-text='masstaggerSubs'
    variant='danger'
  )
  b-badge.no-flair(v-else-if='showNone')
    | (no masstagger subs)
  span.no-flair(v-else)
</template>

<script>
export default {
  name: 'MasstaggerBadge',
  props: {
    type: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: null,
    },
    showNone: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
    username() {
      return this.item.data.author;
    },
    masstaggerSubs() {
      return this.$store.getters['masstagger/find'](this.username);
    },
    isAuthor() {
      return this.MeData.name === this.username;
    },
  },
  mounted() {
    const { isAuthor, username } = this;
    if (!isAuthor) {
      if (username) {
        /* no await */ this.$store.dispatch('masstagger/require', username);
      }
    }
  },
};
</script>

<style lang="sass">
</style>
