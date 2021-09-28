<template lang="pug">
.log-entry
  .card
    .card-header.text-muted
      UserLink(:username='log.mod')
      | &#32;
      //- FlairBadge(:item='comment' type='author')
      //- | &#32;
      TimeAgo(:value='log.created_utc')
      | &#32;
      span(v-text='log.note')
    .card-body
      div
        | {{ log.action }}
        | &#32;
        UserLink(v-if='log.target_author' :username='log.target_author')
        | &#32;
        nuxt-link(v-if='log.target_permalink' :to='log.target_permalink' v-text='log.target_title || log.target_permalink')
        span(v-else-if='log.target_title')
        | &#32;
        b-badge(v-if="log.details")
          | details: {{ log.details }}
    .card-body(v-if="log.description")
      b-badge description:
      div(v-text="log.description")
    .card-body(v-if="log.target_body")
      b-badge description:
      div(v-text="log.target_body")
    .card-footer.text-muted.bg-light()
      a(
        :href='`https://www.reddit.com/user/${log.target_permalink}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-btn.fa-reddit
        span see on reddit
      | &#32;
      nuxt-link(
        :to='`/user/${log.target_permalink}`'
      )
        i.fa.fa-fw.fa-btn.fa-link-ext
        span permalink
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        | &#32;source
    pre.small.text-monospace(v-if="showSource" v-text="log")
</template>

<script>
import get from 'lodash/get';
import FlairBadge from '~/components/FlairBadge';
import UsertagBadge from '~/components/UsertagBadge';
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'ModLogEntry',
  components: {
    FlairBadge,
    UsertagBadge,
    TimeAgo,
    UserLink,
  },
  props: {
    // kind: 'modaction'
    // action: "banuser"
    // created_utc: 1550940279
    // description: "other: mooooooooood note"
    // details: "9 days"
    // id: "ModAction_4fa6943c-378a-11e9-b100-0e78bd91ac66"
    // mod: "le_mod_user"
    // mod_id36: "wjh1g"
    // sr_id36: "ro83j"
    // subreddit: "Nuxtit"
    // subreddit_name_prefixed: "r/Nuxtit"
    // target_author: "le_banned_user"
    // target_body: null
    // target_fullname: "t2_mu233"
    // target_permalink: null
    // target_title: null
    log: {
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
.log-entry
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
