<template lang="pug">
.message-entry
  .card(:class='{"border-info": message.new}')
    .card-header
      b-badge(variant='info' v-if='message.new') new
      | &#32;
      span(v-text='message.subject')
      | &#32;
      em: nuxt-link.text-muted(
        :to='message.context'
        v-text='message.link_title'
      )
      template(v-if='message.author')
        | &#32;from&#32;
        UserLink(:username='message.author')
      | &#32;
      UsertagBadge(:item='message' type='author')
      | &#32;via&#32;
      SubredditLink(
        v-if='message.subreddit'
        :subreddit='message.subreddit'
      )
      | &#32;sent&#32;
      TimeAgo(:value='message.created_utc')
      template(v-if='message.dest')
        | &#32;to&#32;
        UserLink(:username='message.dest')
      .score.pull-right
        i.fa.fa-fw.fa-btn.btn-collapse(
          :class='collapsed ? "fa-plus" : "fa-minus"'
          @click.prevent.stop='toggleCollapsed'
        )
        template(v-if='showVoting')
          | &nbsp;
          | &nbsp;
          UpVote(:item='message')
          | &nbsp;
          | &nbsp;
          Score(:item='message')
          | &nbsp;
          | &nbsp;
          DownVote(:item='message')
          | &nbsp;
          | &nbsp;
    .card-body(v-if="!collapsed")
      ItemHtml(:item='message')
    .card-footer.text-muted.bg-light(v-if="!collapsed")
      AddToQueueButton(:item='message' v-if='message.context')
      | &#32;
      a(
        :href='`https://www.reddit.com${message.context}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-btn.fa-reddit
        span see on reddit
      | &#32;
      nuxt-link(
        :to='message.context'
      )
        i.fa.fa-fw.fa-btn.fa-link-ext
        span permalink
      | &#32;
      ShareButton(:item='message')
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
        span full comments ({{ message.num_comments }})
      | &#32;
      span.btn-reply-toggle(
        @click.prevent.stop='showReply^=true'
      )
        i.fa.fa-fw.fa-btn.fa-reply
        | &#32;reply
      | &#32;
      DeleteButton(:item='message' v-if='isAuthor')
      | &#32;
      ReportButton(:item='message' v-if='!isAuthor')
      | &#32;
      MarkUnreadButton(:item='message' v-if='!isAuthor')
      | &#32;
      BlockUserButton(:item='message' v-if='!isAuthor')
      | &#32;
      //- CrossPostButton(
      //-   @click.prevent.stop='showCrossPost^=true'
      //- )
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        | &#32;source
    CommentForm(
      v-if="showReply && !collapsed"
      :parent='message'
      @append-replies='onAppendReplies'
      @created-comment='onCommentCreated'
      @close='showReply = false'
    )
    CommentForm(
      v-if="showEdit && !collapsed"
      :message='message'
      @updated-comment='onCommentUpdated'
      @close='showEdit = false'
    )
    //- PostForm(
    //-   v-if="showCrossPost && !collapsed"
    //-   :parent='message'
    //-   @created-post='onCrossPostCreated'
    //-   @close='showCrossPost = false'
    //- )
    pre.small.text-monospace(v-if="showSource && !collapsed" v-text="message")
  MessageTree(
    v-if='showReplies && !collapsed'
    :messages='message.replies'
  )
</template>

<script>
import get from 'lodash/get';
import AddToQueueButton from '~/components/AddToQueueButton';
import BlockUserButton from '~/components/BlockUserButton';
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import FlairBadge from '~/components/FlairBadge';
import HideButton from '~/components/HideButton';
import ItemHtml from '~/components/ItemHtml';
import MarkUnreadButton from '~/components/MarkUnreadButton';
import UsertagBadge from '~/components/UsertagBadge';
import MessageTree from '~/components/MessageTree';
import PostForm from '~/components/PostForm';
import RemoveButton from '~/components/RemoveButton';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import SubredditLink from '~/components/SubredditLink';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';
import { Kind } from '~/lib/enum';
import { mapGetters } from 'vuex';

export default {
  name: 'MessageEntry',
  components: {
    AddToQueueButton,
    BlockUserButton,
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    FlairBadge,
    HideButton,
    ItemHtml,
    MarkUnreadButton,
    UsertagBadge,
    MessageTree,
    PostForm,
    RemoveButton,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
    SubredditLink,
    TimeAgo,
    UpVote,
    UserLink,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collapsed: get(this.message, 'collapsed'),
      open: null,
      // open: 'source',
      reply: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['MeData']),
    showVoting() {
      const { kind } = this.message;
      if (kind === Kind.Comment) return true;
      if (kind === Kind.Post) return true;
      return false;
    },
    showReplies() {
      const { replies } = this.message;
      return replies && replies.children && replies.children.length;
    },
    /**
     * compare to CommentEntry.computed.parentTO
     * the JSON here is missing link_id compare
     **/
    parentTo() {
      const { context, link_id, id } = this.message;
      const parent_id = this.message.parent_id
        ? this.message.parent_id.replace('t1_', '')
        : null;
      if (parent_id && context) {
        const search = this.$router.resolve(context);
        if (search && search.route && search.route.params.comment_id) {
          return {
            ...search.route,
            params: {
              ...search.route.params,
              comment_id: parent_id,
            },
          };
        }
      }
      return null;
    },
    linkTo() {
      const { context, id } = this.message;
      if (context) {
        const linkPath = context.replace(`/${id}/`, '/');
        if (this.$route.path !== linkPath && context !== linkPath) {
          return linkPath;
        }
      }
      return null;
    },
    isAuthor() {
      const { author } = this.message;
      return author && author === this.MeData.name;
    },
    showSource: makeComputeToggler('source'),
    showReply: makeComputeToggler('reply'),
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
      this.message.replies = this.message.replies || {
        children: [],
      };

      this.message.replies.children.push(newComment);
    },
    onAppendReplies(replies) {
      this.message.replies = this.message.replies || {
        children: [],
      };

      this.message.replies.children = [
        ...this.message.replies.children,
        ...replies,
      ];
    },
    onCrossPostCreated(newPost) {
      //
    },
  },
};
</script>

<style lang="sass">
.message-entry
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
.message-entry
  .card
    .card-header, .card-footer, .card-body
      padding: 0.20rem;
    .card-header, .card-footer
      span, a
        font-size: 0.85rem;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
</style>
