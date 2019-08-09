<template lang="pug">
  BotBadge(v-if='isBot')
  b-badge(
    v-else-if='tag === true'
    variant='secondary'
  )
    small
      i.fa.fa-fw.fa-spinner.fa-spin
      | &#32;loading tags
  b-badge(
    v-else-if='tag'
    variant='danger'
  )
    small
      i.fa.fa-fw.fa-tag
      | &nbsp;{{ tag }}
  b-badge.no-flair(v-else-if='showNone')
    | (no tags)
  span.no-flair(v-else v-show="false")
</template>

<script>
import BotBadge from '~/components/BotBadge';
import usertags from '~/lib/usertags';
import { isBot } from '~/lib/bots';

// a(
//   v-else-if='masstaggerSubs'
//   :href='`https://masstagger.com/user/${username.toUpperCase()}`'
//   target='_blank'
// )
//   b-badge.badge-mt(
//     v-text='masstaggerSubs'
//     variant='danger'
//   )
export default {
  name: 'UsertagBadge',
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
  data() {
    return {
      tag: true,
    };
  },
  computed: {
    username() {
      return this.name || this.item.data.author;
    },
    isBot() {
      return isBot(this.username);
    },
  },
  watch: {
    username: {
      immediate: true,
      async handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.tag = true;
          this.tag = (await usertags.get(newValue).catch(get_blank_str)) || '';
        }
      },
    },
  },
};

function get_blank_str() {
  return '';
}
</script>

<style lang="sass">
.badge.badge-mt
  white-space: normal;
</style>
