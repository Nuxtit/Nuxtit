<template lang="pug">
  BotBadge(v-if='isBot')
  span.mt-disabled(v-else-if='mtDisabled')
  b-badge(
    v-else-if='masstaggerSubs === true'
    variant='secondary'
    v-show="false /*mt is constantly down*/"
  )
    small
      i.fa.fa-fw.fa-spinner.fa-spin
      | &#32;loading masstagger
  a(
    v-else-if='masstaggerSubs'
    :href='`https://masstagger.com/user/${username.toUpperCase()}`'
    target='_blank'
  )
    b-badge.badge-mt(
      v-text='masstaggerSubs'
      variant='danger'
    )
  b-badge.no-flair(v-else-if='showNone')
    | (no masstagger subs)
  span.no-flair(v-else)
</template>

<script>
import BotBadge from '~/components/BotBadge';
import { isBot } from '~/lib/bots';

export default {
  name: 'MasstaggerBadge',
  components: {
    BotBadge,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
    showNone: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
  },
  computed: {
    username() {
      return this.name || this.item.data.author;
    },
    mtDisabled() {
      return !this.$store.getters['settings/mtEnable'];
    },
    masstaggerSubs() {
      return this.$store.getters['masstagger/find'](this.username);
    },
    isBot() {
      return isBot(this.username);
    },
  },
};
</script>

<style lang="sass">
.badge.badge-mt
  white-space: normal;
</style>
