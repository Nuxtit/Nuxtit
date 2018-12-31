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
      FlairBadge(:item='comment' type='author')
      | &#32;
      MasstaggerBadge(:item='comment' type='author')
      | &#32;
      GildedBadge(:item='comment')
      | &#32;
      b-badge(v-if='comment.data.author_patreon_flair') [patreon]
      | &#32;
      TimeAgo(:value='comment.data.created_utc')
      template(v-if='comment.data.edited') *
      | &#32;
      b-badge(v-if='comment.data.approved', variant='success') [approved]
      | &#32;
      b-badge(v-if='comment.data.removed', variant='danger') [removed]
      | &#32;
      b-badge(v-if='comment.data.spam', variant='danger') [spam]
      | &#32;
      nuxt-link(
        v-if='!$route.params.post_id && comment.data.link_title'
        :to='comment.data.permalink'
      )
        small on {{ comment.data.link_title }}
      .score.pull-right
        i.fa.fa-fw.fa-btn.btn-collapse(
          :class='collapsed ? "fa-plus" : "fa-minus"'
          @click.prevent.stop='toggleCollapsed'
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
    .card-body(v-if="!collapsed")
      ItemHtml(:item='comment')
    .card-footer.text-muted.bg-light(v-if="!collapsed")
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
      SubredditLink(
        v-if='!$route.params.subreddit && comment.data.subreddit'
        :subreddit='comment.data.subreddit'
      )
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
        i.fa.fa-fw.fa-btn.fa-edit
        span edit
      span.btn-reply-toggle(
        v-if='comment.data.send_replies'
        @click.prevent.stop='showReply^=true'
      )
        i.fa.fa-fw.fa-btn.fa-reply
        span reply
      | &#32;
      //- HideButton(:item='comment')
      //- | &#32;
      template(v-if='comment.data.can_mod_post')
        SpamButton(:item='comment')
        | &#32;
        RemoveButton(:item='comment')
        | &#32;
        ApproveButton(:item='comment' v-if='comment.data.removed')
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
        v-if='comment.data.user_reports.length > 0'
        @click.prevent.stop='showReports^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span reports ({{ comment.data.user_reports.length }})
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
      tt: small(v-text="comment.data.user_reports")
    pre(v-if="showSource && !collapsed")
      tt: small(v-text="comment.data")
  CommentTree(
    v-if='showReplies && !collapsed'
    :comments='comment.data.replies'
  )
</template>

<script>
import get from 'lodash/get';
import ApproveButton from '~/components/ApproveButton';
import AddToQueueButton from '~/components/AddToQueueButton';
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import GildedBadge from '~/components/GildedBadge';
import HideButton from '~/components/HideButton';
import ItemHtml from '~/components/ItemHtml';
import MasstaggerBadge from '~/components/MasstaggerBadge';
import PostForm from '~/components/PostForm';
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
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'CommentEntry',
  components: {
    ApproveButton,
    AddToQueueButton,
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    FlairBadge,
    GildedBadge,
    HideButton,
    ItemHtml,
    MasstaggerBadge,
    PostForm,
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
</style>
