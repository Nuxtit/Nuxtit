<template lang="pug">
.subreddit-entry
  .subreddit-row-1
    SubredditLink(:subreddit='subreddit.data.display_name')
    | &#32;
    span(v-text='subreddit.data.title')
  .subreddit-row-2
    ItemHtml(:value='subreddit.data.public_description_html')
  .subreddit-row-3.text-muted
    SubscribeButton(:item='subreddit')
    | &#32;|&#32;
    | {{ subreddit.data.subscribers }} subscribers
    | &#32;|&#32;
    | created
    | &#32;
    TimeAgo(:value='subreddit.data.created_utc')
    | &#32;
    ReportButton(:item='subreddit')
    | &#32;|&#32;
    span.btn-see-source(
      @click.prevent.stop='showSource^=true'
    )
      i.fa.fa-fw.fa-btn.fa-code
      span see source
  .subreddit-row-source(v-if='open')
    pre(v-if='showSource')
      tt: small(v-text="subreddit")
</template>

<script>
import CrossPostButton from '~/components/CrossPostButton';
import ItemHtml from '~/components/ItemHtml';
import ReportButton from '~/components/ReportButton';
import ShareButton from '~/components/ShareButton';
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
    SubredditLink,
    SubscribeButton,
    TimeAgo,
  },
  props: {
    subreddit: {
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
.subreddit-entry + .subreddit-entry
  border-top: 1px solid #444;
.subreddit-entry
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
</style>
