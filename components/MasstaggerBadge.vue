<template lang="pug">
  b-badge(
    v-if='masstaggerSubs === true'
    variant='secondary'
  )
    small
      i.fa.fa-fw.fa-spinner.fa-spin
      | &#32;loading masstagger
  b-badge.badge-mt(
    v-else-if='masstaggerSubs'
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
};
</script>

<style lang="sass">
.badge.badge-mt
  white-space: normal;
</style>
