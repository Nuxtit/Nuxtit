<template lang="pug">
.banned-user-entry
  .card
    .card-header.text-muted
      UserLink(:username='user.name')
      | &#32;
      //- FlairBadge(:item='comment' type='author')
      //- | &#32;
      MasstaggerBadge(:name='user.name')
      | &#32;
      TimeAgo(:value='user.date')
      | &#32;
      span(v-text='user.note')
    .card-footer.text-muted.bg-light()
      a(
        :href='`https://www.reddit.com/user/${user.name}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-btn.fa-reddit
        span see on reddit
      | &#32;
      nuxt-link(
        :to='`/user/${user.name}`'
      )
        i.fa.fa-fw.fa-btn.fa-external-link
        span permalink
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span see source
    pre(v-if="showSource")
      tt: small(v-text="user")
</template>

<script>
import get from 'lodash/get';
import FlairBadge from '~/components/FlairBadge';
import MasstaggerBadge from '~/components/MasstaggerBadge';
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';
import { mapGetters } from 'vuex';

export default {
  name: 'BannedUserEntry',
  components: {
    FlairBadge,
    MasstaggerBadge,
    TimeAgo,
    UserLink,
  },
  props: {
    // date: 1550940279
    // id: "t2_ABCDE"
    // name: "le_username"
    // note: "other: mooooooooood note"
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: null,
    };
  },
  computed: {
    showSource: makeComputeToggler('source'),
  },
};
</script>

<style lang="sass">
.banned-user-entry
  .card
    .card-header, .card-footer, .card-body
      padding: 0.20rem;
    .card-header, .card-footer
      span, a
        font-size: 0.85rem;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
  .options-icons
    margin-top: -1rem;
</style>
