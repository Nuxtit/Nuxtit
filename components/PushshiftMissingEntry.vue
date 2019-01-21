<template lang="pug">
.pushshift-missing-entry
  .row PushshiftMissing {{ item.data.id }}
  .row
    //- .col-thumbnail
    //-   PostThumbnail(
    //-     :item="item"
    //-     @expand="showImage^=true"
    //-   )
    .col-other
      //- .row
      //-   .col
      //-     nuxt-link(
      //-       v-if="item.data.is_self"
      //-       :to='item.data.permalink'
      //-       v-text='item.data.title'
      //-     )
      //-     a(
      //-       v-if="!item.data.is_self"
      //-       :href='item.data.url'
      //-       target='_blank'
      //-       ref='nofollow'
      //-       v-text='item.data.title'
      //-     )
      //-     | &#32;
      //-     FlairBadge(:item='item' type='link')
      //-     | &#32;
      //-     b-badge(v-if='item.data.is_video') [video]
      //-     | &#32;
      //-     b-badge(v-if='item.data.stickied') [stickied]
      //-     | &#32;
      //-     b-badge(v-if='item.data.pinned') [pinned]
      //-     | &#32;
      //-     b-badge(v-if='item.data.over_18') [nsfw]
      //-     | &#32;
      //-     b-badge(v-if='item.data.spoiler') [spoiler]
      //-     | &#32;
      //-     b-badge(v-if='item.data.locked') [locked]
      //-     | &#32;
      //-     b-badge(v-if='item.data.author_patreon_flair') [patreon]
      //-     | &#32;
      //-     b-badge(v-if='item.data.author_cakeday') [cakeday]
      //-     | &#32;
      //-     b-badge(v-if='item.data.approved', variant='success') [approved]
      //-     | &#32;
      //-     b-badge(v-if='item.data.removed', variant='danger')
      //-       template(v-if='item.data.removal_reason') [removed: {{item.data.removal_reason}}]
      //-       template [removed]
      //-     | &#32;
      //-     b-badge(v-if='item.data.spam', variant='danger') [spam]
      //-     | &#32;
      //-     b-badge(v-if='item.data.num_crossposts') [crossposts: {{ item.data.num_crossposts }}]
      //-     | &#32;
      //-     small(v-if='item.data.domain'): tt
      //-       nuxt-link(
      //-         :to='item.data.is_self ? `/r/${item.data.domain}` : `/domain/${item.data.domain}`'
      //-         v-text='`(${item.data.domain})`'
      //-       )
      //-     .score.pull-right
      //-       UpVote(:item='item')
      //-       | &#32;
      //-       Score(:item='item')
      //-       | &#32;
      //-       DownVote(:item='item')
      //- .row
      //-   .col.small
      //-     | submitted
      //-     | &#32;
      //-     TimeAgo(:value='item.data.created_utc')
      //-     template(v-if='item.data.edited') *
      //-     | &#32;
      //-     | by
      //-     | &#32;
      //-     UserLink(:username='item.data.author')
      //-     | &#32;
      //-     FlairBadge(:item='item' type='author')
      //-     | &#32;
      //-     MasstaggerBadge(:item='item' type='author')
      //-     | &#32;
      //-     GildedBadge(:item='item')
      //-     | &#32;
      //-     | to
      //-     | &#32;
      //-     SubredditLink(:subreddit='item.data.subreddit')
      //-     | &#32;
      //-     b-badge(v-if='item.data.quarantine')
      //-       | [quarantine]
      //-     | &#32;
      .row
        .col.small
          //- AddToQueueButton(:item='item')
          //- | &#32;
          //- nuxt-link(
          //-   :to='item.data.permalink'
          //- )
          //-   i.fa.fa-fw.fa-btn.fa-comments
          //-   span comments ({{ item.data.num_comments }})
          //- | &#32;
          //- a(
          //-   :href='`https://www.reddit.com${item.data.permalink}`'
          //-   target='_blank'
          //- )
          //-   i.fa.fa-fw.fa-btn.fa-reddit
          //-   span see on reddit
          //- | &#32;
          //- SaveButton(:item='item')
          //- | &#32;
          //- ShareButton(:item='item')
          //- | &#32;
          //- HideButton(:item='item')
          //- | &#32;
          //- template(v-if='item.data.can_mod_post')
          //-   SpamButton(:item='item')
          //-   | &#32;
          //-   RemoveButton(:item='item')
          //-   | &#32;
          //-   ApproveButton(:item='item')
          //-   | &#32;
          //-   LockButton(:item='item')
          //-   | &#32;
          //- template(v-if='isAuthor || item.data.can_mod_post')
          //-   NsfwButton(:item='item')
          //-   | &#32;
          //-   SpoilerButton(:item='item')
          //-   | &#32;
          //- template(v-if='isAuthor')
          //-   DeleteButton(:item='item')
          //-   | &#32;
          //-   span.btn-edit-toggle(
          //-     @click.prevent.stop='showEdit^=true'
          //-   )
          //-     i.fa.fa-fw.fa-btn.fa-edit
          //-     span edit
          //- template(v-if='!isAuthor')
          //-   //- GiveGoldButton(:item='item')
          //-   //- | &#32;
          //-   ReportButton(:item='item')
          //-   | &#32;
          //- span.btn-reply-toggle(
          //-   vif="item.data.send_replies"
          //-   @click.prevent.stop='showReply^=true'
          //- )
          //-   i.fa.fa-fw.fa-btn.fa-reply
          //-   span reply
          //- | &#32;
          //- CrossPostButton(
          //-   @click.prevent.stop='showCrossPost^=true'
          //- )
          //- | &#32;
          //- span.btn-see-reports(
          //-   v-if='item.data.user_reports.length > 0'
          //-   @click.prevent.stop='showReports^=true'
          //- )
          //-   i.fa.fa-fw.fa-btn.fa-bullhorn
          //-   | &#32;
          //-   span reports ({{ item.data.user_reports.length }})
          //- | &#32;
          span.btn-see-source(
            @click.prevent.stop='showSource^=true'
          )
            i.fa.fa-fw.fa-btn.fa-code
            span see source
  .row(v-if='open')
    .col
      //- CommentForm(
      //-   v-if="showReply"
      //-   :parent='item'
      //-   @updated-comment='onCommentCreated'
      //-   @close='showReply = false'
      //- )
      //- PostForm(
      //-   v-if="showEdit"
      //-   :item='item'
      //-   @created-comment='onPostUpdated'
      //-   @close='showEdit = false'
      //- )
      //- PostForm(
      //-   v-if="showCrossPost"
      //-   :parent='item'
      //-   @created-item='onCrossPostCreated'
      //-   @close='showCrossPost = false'
      //- )
      //- PostImage(
      //-   v-if="showImage"
      //-   :item='item'
      //-   @close='showImage = false'
      //- )
      pre(v-if='showSource')
        tt: small(v-text="item")
</template>

<script>
import AddToQueueButton from '~/components/AddToQueueButton';
import ApproveButton from '~/components/ApproveButton';
import CommentEntry from '~/components/CommentEntry';
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import GildedBadge from '~/components/GildedBadge';
import HideButton from '~/components/HideButton';
import LockButton from '~/components/LockButton';
import MasstaggerBadge from '~/components/MasstaggerBadge';
import NsfwButton from '~/components/NsfwButton';
import PostForm from '~/components/PostForm';
import PostImage from '~/components/PostImage';
import PostThumbnail from '~/components/PostThumbnail';
import RemoveButton from '~/components/RemoveButton';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import SpamButton from '~/components/SpamButton';
import SpoilerButton from '~/components/SpoilerButton';
import SubredditLink from '~/components/SubredditLink';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'PushshiftMissingEntry',
  components: {
    AddToQueueButton,
    ApproveButton,
    CommentEntry,
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    FlairBadge,
    GildedBadge,
    HideButton,
    LockButton,
    MasstaggerBadge,
    NsfwButton,
    PostForm,
    PostImage,
    PostThumbnail,
    RemoveButton,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
    SpamButton,
    SpoilerButton,
    SubredditLink,
    TimeAgo,
    UpVote,
    UserLink,
  },
  props: {
    item: {
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
    isAuthor() {
      const { author } = this.item.data;
      return author && author === this.MeData.name;
    },
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
    showSource: makeComputeToggler('source'),
    showReply: makeComputeToggler('reply'),
    showReports: makeComputeToggler('reports'),
    showEdit: makeComputeToggler('edit'),
    showCrossPost: makeComputeToggler('cross'),
    showImage: makeComputeToggler('image'),
  },
  methods: {
    onPostUpdated(updatedPost) {
      // @todo
    },
    onCommentCreated(newComment) {
      // this.comment.data.replies = this.comment.data.replies || {
      //   data: {
      //     children: [],
      //   },
      // };
      // this.comment.data.replies.data.children.push(newComment);
      this.item.data.num_comments++;
    },
    onCrossPostCreated(newCrossPost) {
      // @todo
    },
  },
};
</script>

<style lang="sass">
.item-entry + .item-entry
  border-top: 1px solid #444;
.item-entry
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  .col-thumbnail, .col-other
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  .col-thumbnail
    width: 140px;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 15px;
    margin-left: 15px;
    text-align: center;
  .col-other
    padding-left: 0px;
    flex: 1;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
</style>
