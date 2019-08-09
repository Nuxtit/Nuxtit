<template lang="pug">
.post-entry
  .row
    .col-thumbnail(v-if='showThumbnail')
      PostThumbnail(
        :post="post"
        @expand="showImage^=true"
      )
    .col-other
      .row
        .col
          nuxt-link(
            v-if="post.data.is_self"
            :to='post.data.permalink'
            v-text='post.data.title'
          )
          a(
            v-if="!post.data.is_self"
            :href='postUrl'
            target='_blank'
            ref='nofollow'
            v-text='post.data.title'
          )
          | &#32;
          FlairBadge(:item='post' type='link')
          | &#32;
          b-badge(v-if='post.data.is_video') [video]
          | &#32;
          b-badge(v-if='post.data.stickied') [stickied]
          | &#32;
          b-badge(v-if='post.data.pinned') [pinned]
          | &#32;
          b-badge(v-if='post.data.over_18') [nsfw]
          | &#32;
          b-badge(v-if='post.data.spoiler') [spoiler]
          | &#32;
          b-badge(v-if='post.data.locked') [locked]
          | &#32;
          b-badge(v-if='post.data.author_patreon_flair') [patreon]
          | &#32;
          b-badge(v-if='post.data.author_cakeday') [cakeday]
          | &#32;
          ApprovedBadge(:item="post")
          | &#32;
          RemovedBadge(:item="post")
          | &#32;
          b-badge(v-if='post.data.spam', variant='danger') [spam]
          | &#32;
          b-badge(v-if='post.data.num_crossposts') [crossposts: {{ post.data.num_crossposts }}]
          | &#32;
          small(v-if='post.data.domain'): tt
            nuxt-link(
              :to='post.data.is_self ? `/r/${post.data.domain}` : `/domain/${post.data.domain}`'
              v-text='`(${post.data.domain})`'
            )
          .score.pull-right
            UpVote(:item='post')
            | &#32;
            Score(:item='post')
            | &#32;
            DownVote(:item='post')
      .row
        .col.small
          | submitted
          | &#32;
          TimeAgo(:value='post.data.created_utc')
          template(v-if='post.data.edited') *
          | &#32;
          | by
          | &#32;
          UserLink(:username='post.data.author')
          | &#32;
          FlairBadge(:item='post' type='author')
          | &#32;
          UsertagBadge(:item='post' type='author')
          | &#32;
          GildedBadge(:item='post')
          | &#32;
          | to
          | &#32;
          SubredditLink(:subreddit='post.data.subreddit')
          | &#32;
          b-badge(v-if='post.data.quarantine')
            | [quarantine]
          | &#32;
      .row
        .col.small
          AddToQueueButton(:item='post')
          | &#32;
          nuxt-link(
            :to='post.data.permalink'
          )
            i.fa.fa-fw.fa-btn.fa-comments
            span comments ({{ post.data.num_comments }})
          | &#32;
          a(
            :href='`https://www.reddit.com${post.data.permalink}`'
            target='_blank'
          )
            i.fa.fa-fw.fa-btn.fa-reddit
            span see on reddit
          | &#32;
          SaveButton(:item='post')
          | &#32;
          ShareButton(:item='post')
          | &#32;
          HideButton(:item='post')
          | &#32;
          template(v-if='post.data.can_mod_post')
            SpamButton(:item='post')
            | &#32;
            RemoveButton(:item='post')
            | &#32;
            BanButton(:item='post')
            | &#32;
            ApproveButton(:item='post')
            | &#32;
            AddContributorButton(:item='post')
            | &#32;
            LockButton(:item='post')
            | &#32;
          template(v-if='isAuthor || post.data.can_mod_post')
            NsfwButton(:item='post')
            | &#32;
            SpoilerButton(:item='post')
            | &#32;
          template(v-if='isAuthor')
            DeleteButton(:item='post')
            | &#32;
            span.btn-edit-toggle(
              @click.prevent.stop='showEdit^=true'
            )
              i.fa.fa-fw.fa-btn.fa-edit
              span edit
          template(v-if='!isAuthor')
            //- GiveGoldButton(:item='post')
            //- | &#32;
            ReportButton(:item='post')
            | &#32;
          span.btn-reply-toggle(
            vif="post.data.send_replies"
            @click.prevent.stop='showReply^=true'
          )
            i.fa.fa-fw.fa-btn.fa-reply
            span reply
          | &#32;
          CrossPostButton(
            @click.prevent.stop='showCrossPost^=true'
          )
          | &#32;
          TumblrShareButton(
            @click.prevent.stop='showTumblrShare^=true'
          )
          | &#32;
          span.btn-see-reports(
            v-if='post.data.user_reports && post.data.user_reports.length > 0'
            @click.prevent.stop='showReports^=true'
          )
            i.fa.fa-fw.fa-btn.fa-bullhorn
            | &#32;
            span reports ({{ post.data.user_reports.length }})
          | &#32;
          span.btn-see-source(
            @click.prevent.stop='showSource^=true'
          )
            i.fa.fa-fw.fa-btn.fa-code
            span see source
  .row(v-if='open')
    .col
      CommentForm(
        v-if="showReply"
        :parent='post'
        @updated-comment='onCommentCreated'
        @close='showReply = false'
      )
      PostForm(
        v-if="showEdit"
        :post='post'
        @created-comment='onPostUpdated'
        @close='showEdit = false'
      )
      PostForm(
        v-if="showCrossPost"
        :parent='post'
        @created-post='onCrossPostCreated'
        @close='showCrossPost = false'
      )
      TumblrShareForm(
        v-if="showTumblrShare"
        :parent='post'
        @created-post='onTumblrShareCreated'
        @close='showTumblrShare = false'
      )
      PostImage(
        v-if="showImage || showTumblrShare"
        :post='post'
        @close='showImage = false'
      )
      pre(v-if="showReports")
        .alert.alert-danger(v-if="post.data.user_reports && post.data.user_reports.length > 0")
          tt: small(v-text="post.data.user_reports")
        .alert.alert-info(v-if="post.data.user_reports_dismissed && post.data.user_reports_dismissed.length > 0")
          tt: small(v-text="post.data.user_reports_dismissed")
      pre(v-if='showSource')
        tt: small(v-text="post")
</template>

<script>
import AddToQueueButton from '~/components/AddToQueueButton';
import ApproveButton from '~/components/ApproveButton';
import ApprovedBadge from '~/components/ApprovedBadge';
import AddContributorButton from '~/components/AddContributorButton';
import BanButton from '~/components/BanButton';
import CommentEntry from '~/components/CommentEntry';
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import GildedBadge from '~/components/GildedBadge';
import HideButton from '~/components/HideButton';
import LockButton from '~/components/LockButton';
import UsertagBadge from '~/components/UsertagBadge';
import NsfwButton from '~/components/NsfwButton';
import PostForm from '~/components/PostForm';
import PostImage from '~/components/PostImage';
import PostThumbnail from '~/components/PostThumbnail';
import RemoveButton from '~/components/RemoveButton';
import RemovedBadge from '~/components/RemovedBadge';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import SpamButton from '~/components/SpamButton';
import SpoilerButton from '~/components/SpoilerButton';
import SubredditLink from '~/components/SubredditLink';
import TimeAgo from '~/components/TimeAgo';
import TumblrShareButton from '~/components/TumblrShareButton';
import TumblrShareForm from '~/components/TumblrShareForm';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';
import { mapGetters } from 'vuex';

const linkRegEx = /https{0,1}:\/\/(i\.|www\.|np\.|old\.){0,1}reddit\.com\//gim;
const newLink = '/';

export default {
  name: 'PostEntry',
  components: {
    AddToQueueButton,
    ApproveButton,
    ApprovedBadge,
    AddContributorButton,
    BanButton,
    CommentEntry,
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    FlairBadge,
    GildedBadge,
    HideButton,
    LockButton,
    UsertagBadge,
    NsfwButton,
    PostForm,
    PostImage,
    PostThumbnail,
    RemoveButton,
    RemovedBadge,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
    SpamButton,
    SpoilerButton,
    SubredditLink,
    TimeAgo,
    TumblrShareButton,
    TumblrShareForm,
    UpVote,
    UserLink,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    showThumbnail: {
      type: Boolean,
      default: true,
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
    ...mapGetters('auth', ['MeData', 'usernames']),
    isAuthor() {
      const { author } = this.post.data;
      return this.usernames.includes(author);
    },
    postUrl() {
      let url = this.post.data.url || '';
      url = url.replace(linkRegEx, newLink);
      return url;
    },
    showSource: makeComputeToggler('source'),
    showReply: makeComputeToggler('reply'),
    showReports: makeComputeToggler('reports'),
    showEdit: makeComputeToggler('edit'),
    showCrossPost: makeComputeToggler('cross'),
    showTumblrShare: makeComputeToggler('tumblr'),
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
      this.post.data.num_comments++;
    },
    onCrossPostCreated(newCrossPost) {
      // @todo
    },
    onTumblrShareCreated(newTumblrShare) {
      // @todo
    },
  },
};
</script>

<style lang="sass">
.post-entry + .post-entry
  border-top: 1px solid #444;
.post-entry
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
