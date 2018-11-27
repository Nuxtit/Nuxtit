<template lang="pug">
.multi-entry
  .multi-row-1
    MultiLink(:name='multi.data.name')
    | &#32;
    span(v-text='multi.data.title')
  .multi-row-2
    ItemHtml(:value='multi.data.public_description_html')
  .multi-row-3
    template(v-for='sr in multi.data.subreddits')
      | &#32;
      SubredditLink(
        :subreddit='sr.name'
        :key='sr.name'
      )
  .multi-row-4.text-muted
    | created
    | &#32;
    TimeAgo(:value='multi.data.created_utc')
    | &#32;
    ReportButton(:item='multi')
    | &#32;|&#32;
    span.btn-see-source(
      @click.prevent.stop='showSource^=true'
    )
      i.fa.fa-fw.fa-btn.fa-code
      span see source
  .multi-row-source(v-if='open')
    pre(v-if='showSource')
      tt: small(v-text="multi.data")
</template>

<script>
import CrossPostButton from '~/components/CrossPostButton';
import ItemHtml from '~/components/ItemHtml';
import ReportButton from '~/components/ReportButton';
import ShareButton from '~/components/ShareButton';
import MultiLink from '~/components/MultiLink';
import SubredditLink from '~/components/SubredditLink';
import SubscribeButton from '~/components/SubscribeButton.vue';
import TimeAgo from '~/components/TimeAgo';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'SubredditEntry',
  components: {
    ItemHtml,
    ReportButton,
    ShareButton,
    MultiLink,
    SubredditLink,
    SubscribeButton,
    TimeAgo,
  },
  props: {
    multi: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // collapsed: false,
      open: null,
      // reply: null,
    };
  },
  computed: {
    showSource: makeComputeToggler('source'),
  },
};
</script>

<style lang="sass">
.multi-entry + .multi-entry
  border-top: 1px solid #444;
.multi-entry
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
</style>
