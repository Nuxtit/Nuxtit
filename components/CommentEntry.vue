<template lang="pug">
.comment-entry
  .card
    .card-header.text-muted
      b-badge(v-if='comment.data.stickied')
        | [stickied]
      | &#32;
      UserLink(:username='comment.data.author')
      | &#32;
      b-badge(v-if='comment.data.is_submitter')
        | [OP]
      | &#32;
      b-badge(v-if='comment.data.locked') [locked]
      | &#32;
      FlairBadge(:item='comment' type='author')
      | &#32;
      UsertagBadge(:item='comment' type='author')
      | &#32;
      GildedBadge(:item='comment')
      | &#32;
      b-badge(v-if='comment.data.author_patreon_flair') [patreon]
      | &#32;
      b-badge(v-if='comment.data.author_cakeday') [cakeday]
      | &#32;
      TimeAgo(:value='comment.data.created_utc')
      template(v-if='comment.data.edited') *
      | &#32;
      ApprovedBadge(:item="comment")
      | &#32;
      RemovedBadge(:item="comment")
      | &#32;
      b-badge(v-if='comment.data.spam', variant='danger') [spam]
      | &#32;
      SubredditLink(
        v-if='showSubreddit'
        :subreddit='comment.data.subreddit'
      )
      | &#32;
      nuxt-link(
        v-if='!$route.params.post_id && comment.data.link_title'
        :to='comment.data.permalink'
      )
        small on {{ comment.data.link_title }}
      .pull-right
        i.fa.fa-fw.fa-btn.btn-collapse(
          :class='collapsed ? "fa-plus" : "fa-minus"'
          @click.prevent.stop='toggleCollapsed'
        )
    .card-body(v-if="!collapsed")
      ItemHtml(:item='comment')
      .options-icons.pull-right
        span.btn-reply-toggle(
          v-if='comment.data.send_replies'
          :class='showReply ? "text-info" : ""'
          @click.prevent.stop='showReply^=true'
        )
          i.fa.fa-fw.fa-btn.fa-reply
        | &nbsp;
        | &nbsp;
        i.fa.fa-cog.fa-fw.fa-btn.btn-options(
          :class='showOptions ? "text-info" : ""'
          @click.prevent.stop='showOptions^=true'
        )
        | &nbsp;
        | &nbsp;
        UpVote(:item='comment')
        | &nbsp;
        | &nbsp;
        Score(:item='comment')
        | &nbsp;
        | &nbsp;
        DownVote(:item='comment')
        | &nbsp;
        | &nbsp;
    .card-footer.text-muted.bg-light(v-if="!collapsed && showOptions")
      AddToQueueButton(:item='comment')
      | &#32;
      a(
        :href='`https://www.reddit.com${comment.data.permalink}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-btn.fa-reddit
        span see on reddit
      | &#32;
      nuxt-link(
        :to='comment.data.permalink'
      )
        i.fa.fa-fw.fa-btn.fa-external-link
        span permalink
      | &#32;
      SaveButton(:item='comment')
      | &#32;
      ShareButton(:item='comment')
      | &#32;
      nuxt-link(
        v-if='parentTo'
        :to='parentTo'
      )
        i.fa.fa-fw.fa-btn.fa-level-up
        span parent
      | &#32;
      nuxt-link(
        v-if='linkTo'
        :to='linkTo'
      )
        i.fa.fa-fw.fa-btn.fa-level-up
        span full comments
      | &#32;
      span.btn-edit-toggle(
        v-if='isAuthor'
        @click.prevent.stop='showEdit^=true'
      )
        i.fa.fa-fw.fa-btn.fa-pencil-square-o
        span edit
      | &#32;
      //- HideButton(:item='comment')
      //- | &#32;
      template(v-if='comment.data.can_mod_post')
        SpamButton(:item='comment')
        | &#32;
        RemoveButton(:item='comment')
        | &#32;
        BanButton(:item='comment')
        | &#32;
        ApproveButton(:item='comment')
        | &#32;
        AddContributorButton(:item='comment')
        | &#32;
        LockButton(:item='comment')
        | &#32;
      DeleteButton(:item='comment' v-if='isAuthor')
      | &#32;
      //- GiveGoldButton(:item='comment' v-if='!isAuthor')
      //- | &#32;
      ReportButton(:item='comment' v-if='!isAuthor')
      | &#32;
      CrossPostButton(
        @click.prevent.stop='showCrossPost^=true'
      )
      span.btn-see-reports(
        v-if='comment.data.user_reports && comment.data.user_reports.length > 0'
        @click.prevent.stop='showReports^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span reports ({{ comment.data.user_reports.length }})
      span.btn-see-reports(
        v-if='comment.data.user_reports_dismissed && comment.data.user_reports_dismissed.length > 0'
        @click.prevent.stop='showReports^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span reports (dismissed) ({{ comment.data.user_reports_dismissed.length }})
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span see source
    CommentForm(
      v-if="showReply && !collapsed"
      :parent='comment'
      @created-comment='onCommentCreated'
      @close='showReply = false'
    )
    CommentForm(
      v-if="showEdit && !collapsed"
      :comment='comment'
      @updated-comment='onCommentUpdated'
      @close='showEdit = false'
    )
    PostForm(
      v-if="showCrossPost && !collapsed"
      :parent='item'
      @created-post='onCrossPostCreated'
      @close='showCrossPost = false'
    )
    pre(v-if="showReports && !collapsed")
      .alert.alert-danger(v-if="comment.data.user_reports && comment.data.user_reports.length > 0")
        tt: small(v-text="comment.data.user_reports")
      .alert.alert-info(v-if="comment.data.user_reports_dismissed && comment.data.user_reports_dismissed.length > 0")
        tt: small(v-text="comment.data.user_reports_dismissed")
    pre(v-if="showSource && !collapsed")
      tt: small(v-text="comment")
  CommentTree(
    v-if='showReplies && !collapsed'
    :comments='comment.data.replies'
  )
</template>

<script>
import get from 'lodash/get';
import ApproveButton from '~/components/ApproveButton';
import ApprovedBadge from '~/components/ApprovedBadge';
import AddToQueueButton from '~/components/AddToQueueButton';
import AddContributorButton from '~/components/AddContributorButton';
import BanButton from '~/components/BanButton';
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import GildedBadge from '~/components/GildedBadge';
import HideButton from '~/components/HideButton';
import ItemHtml from '~/components/ItemHtml';
import LockButton from '~/components/LockButton';
import UsertagBadge from '~/components/UsertagBadge';
import PostForm from '~/components/PostForm';
import RemovedBadge from '~/components/RemovedBadge';
import RemoveButton from '~/components/RemoveButton';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import SpamButton from '~/components/SpamButton';
import SubredditLink from '~/components/SubredditLink';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import { isVirtualSubreddit } from '~/lib/subreddit';
import { makeComputeToggler } from '~/lib/toggle_open';
import { mapGetters } from 'vuex';

export default {
  name: 'CommentEntry',
  components: {
    ApproveButton,
    ApprovedBadge,
    AddToQueueButton,
    AddContributorButton,
    BanButton,
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    FlairBadge,
    GildedBadge,
    HideButton,
    ItemHtml,
    LockButton,
    UsertagBadge,
    PostForm,
    RemovedBadge,
    RemoveButton,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
    SpamButton,
    SubredditLink,
    TimeAgo,
    UpVote,
    UserLink,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collapsed: get(this.comment, 'data.collapsed'),
      open: null,
      reply: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['MeData', 'usernames']),
    isRemoved() {
      if (this.comment.data.removed) {
        return true;
      }
      if (!this.comment.data.approved) {
        // @link https://old.reddit.com/r/bugs/comments/ak741x/when_automoderator_removes_a_comment_in_the_api/?
        if (this.comment.data.banned_by === 'AutoModerator') {
          return true;
        }
      }
      return false;
    },
    showReplies() {
      const { replies } = this.comment.data;
      return replies && replies.data.children && replies.data.children.length;
    },
    parentTo() {
      const { parent_id, permalink, link_id, id } = this.comment.data;
      if (parent_id && parent_id !== link_id && permalink) {
        return permalink.replace(id, parent_id.slice(3));
      }
      return null;
    },
    linkTo() {
      const { parent_id, permalink, link_id, id } = this.comment.data;
      if (parent_id && permalink) {
        const linkPath = permalink.replace(`/${id}/`, '/');
        if (this.$route.path !== linkPath) {
          return linkPath;
        }
      }
      return null;
    },
    isAuthor() {
      const { author } = this.comment.data;
      return this.usernames.includes(author);
    },
    showSubreddit() {
      if (!this.comment.data.subreddit) return false;
      if (!this.$route.params.subreddit) return true;
      return isVirtualSubreddit(this.$route.params.subreddit);
    },
    showSource: makeComputeToggler('source'),
    showReply: makeComputeToggler('reply'),
    showReports: makeComputeToggler('reports'),
    showEdit: makeComputeToggler('edit'),
    showCrossPost: makeComputeToggler('cross'),
    showOptions: makeComputeToggler('options'),
  },
  mounted() {
    if (get(this.comment, 'data.user_reports.length') > 0) {
      this.showOptions = true;
    }
  },
  methods: {
    toggleCollapsed($event) {
      this.collapsed ^= true;
    },
    setCollapsed(value) {
      this.collapsed = !!value;
    },
    onCommentUpdated(updatedComment) {
      // @todo
    },
    onCommentCreated(newComment) {
      this.comment.data.replies = this.comment.data.replies || {
        data: {
          children: [],
        },
      };

      this.comment.data.replies.data.children.push(newComment);
    },
    onCrossPostCreated(newPost) {
      //
    },
  },
};
</script>

<style lang="sass">
.comment-entry
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
