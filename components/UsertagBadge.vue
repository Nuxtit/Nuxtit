<template lang="pug">
  span(@click.prevent.stop="prompt")
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
      | (no tags)
    span.no-flair(v-else v-show="false")
    b-modal(
      v-model="showingUsertagModal"
      title="Usertag User"
      size="md"
      no-close-on-backdrop
      scrollable
      lazy
      @click.stop.prevent
    )
      nuxt-link(:to="`/redusa/settings/usertags`") Usertags Page
      .form-group
        label who to Usertag:
        b-form-input(
          v-model="add_username"
          :disabled="true"
        )
      .form-group
        label Tag:
        b-form-input(
          v-model="add_tag"
        )
      a(
        :href='`https://masstagger.com/user/${username.toUpperCase()}`'
        target='_blank'
      ) See <tt>{{username}}</tt> on masstagger
      br(v-if="masstaggerSubs")
      .alert.alert-danger(v-if="masstaggerSubs" v-text="masstaggerSubs")
      .w-100(slot="modal-footer")
        .btn-group.float-right
          b-button(
            size="sm"
            variant="primary"
            @click="showingUsertagModal=false"
          ) DONE
</template>

<script>
import BotBadge from '~/components/BotBadge';
import TimeAgo from '~/components/TimeAgo';
import usertags from '~/lib/usertags';
import { isBot } from '~/lib/bots';

export default {
  name: 'UsertagBadge',
  components: {
    BotBadge,
    TimeAgo,
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
      showingUsertagModal: false,
      add_username: '',
      add_tag: '',
    };
  },
  computed: {
    username() {
      return this.name || this.item.data.author;
    },
    isBot() {
      return isBot(this.username);
    },
    masstaggerSubs() {
      const value = this.$store.getters['masstagger/find'](this.username);
      if (value !== true) return value;
      return '';
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
  methods: {
    async prompt($event) {
      if (this.showingUsertagModal) return;
      this.showingUsertagModal = true;
      this.add_username = this.username;
      this.add_tag = '';
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
