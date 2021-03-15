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
          b-badge(v-if='post.data.is_video') [video]&#32;
          b-badge(v-if='post.data.stickied') [stickied]&#32;
          b-badge(v-if='post.data.pinned') [pinned]&#32;
          b-badge(v-if='post.data.over_18') [nsfw]&#32;
          b-badge(v-if='post.data.spoiler') [spoiler]&#32;
          b-badge(v-if='post.data.locked') [locked]&#32;
          b-badge(v-if='post.data.author_patreon_flair') [patreon]&#32;
          b-badge(v-if='post.data.author_cakeday') [cakeday]&#32;
          b-badge(v-if='post.data.send_replies===false') [send_replies:0]&#32;
          b-badge(v-if='post.data.poll_data') [poll]&#32;
          ApprovedBadge(:item="post")
          | &#32;
          RemovedBadge(:item="post")
          | &#32;
          b-badge(v-if='post.data.spam', variant='danger') [spam]&#32;
          PostCrossposts(:post="post")
          PostDomain(:post="post")
          .score.pull-right
            UpVote(:item='post')
            | &#32;
            Score(:item='post')
            | &#32;
            DownVote(:item='post')
      .row
        .col
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
        .col
          AddToQueueButton(:item='post')
          | &#32;
          nuxt-link(
            :to='post.data.permalink'
          )
            i.fa.fa-fw.fa-btn.fa-chat
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
            LockButton(:item='post')
            | &#32;
          AddContributorButton(:item='post')
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
            @click.prevent.stop='showReply^=true'
          )
            i.fa.fa-fw.fa-btn.fa-reply
            | &#32;reply
          | &#32;
          CrossPostButton(
            @click.prevent.stop='showCrossPost^=true'
          )
          | &#32;
          SeeReportsButton(:item="post" @click.prevent.stop='showReports^=true')
          | &#32;
          span.btn-see-source(
            @click.prevent.stop='showSource^=true'
          )
            i.fa.fa-fw.fa-btn.fa-code
            | &#32;see source
  .row(v-if='post.data.crosspost_parent_list && post.data.crosspost_parent_list.length > 0 && showCrossPost')
    .col
      div crosspost history:
      table.table.table-sm
        thead
          th score
          th sub
          th by
          th title
          th created
        tbody
          tr(v-for="p in post.data.crosspost_parent_list")
            td(v-text="p.score")
            td: SubredditLink(:subreddit='p.subreddit')
            td: UserLink(:username='p.author')
            td: nuxt-link(:to='p.permalink' v-text='p.title')
            td: TimeAgo(:value='p.created_utc')
  .row(v-if='open || showReply')
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
      CrossPostTabs(
        v-if="showCrossPost"
        :parent='post'
        @created-post='onCrossPostCreated'
        @close='showCrossPost = false'
      )
      PostImage(
        v-if="showImage || showCrossPost"
        :post='post'
        @close='showImage = false'
      )
      ShowReports(v-if="showReports" :item="post")
      pre.small.text-monospace(v-if='showSource' v-text="post")
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
import CrossPostTabs from '~/components/CrossPostTabs';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import GildedBadge from '~/components/GildedBadge';
import HideButton from '~/components/HideButton';
import LockButton from '~/components/LockButton';
import UsertagBadge from '~/components/UsertagBadge';
import NsfwButton from '~/components/NsfwButton';
import PostCrossposts from '~/components/PostCrossposts';
import PostDomain from '~/components/PostDomain';
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
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import ShowReports from '~/components/ShowReports';
import SeeReportsButton from '~/components/SeeReportsButton';
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
    CrossPostTabs,
    DeleteButton,
    DownVote,
    FlairBadge,
    GildedBadge,
    HideButton,
    LockButton,
    UsertagBadge,
    NsfwButton,
    PostCrossposts,
    PostDomain,
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
    UpVote,
    UserLink,
    ShowReports,
    SeeReportsButton,
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
      showReply: false,
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
    showReports: makeComputeToggler('reports'),
    showEdit: makeComputeToggler('edit'),
    showCrossPost: makeComputeToggler('cross'),
    showImage: makeComputeToggler('image'),
  },
  // mounted() {
  //   if (this.reportsCount > 0) {
  //     this.showOptions = true;
  //   }
  //   if (get(this.post, 'data.saved')) {
  //     this.showOptions = true;
  //   }
  // },
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
  font-size: 1rem;
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
