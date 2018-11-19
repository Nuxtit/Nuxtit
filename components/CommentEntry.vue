<template lang="pug">
.comment-entry(
  :data-parent-id='comment.data.parent_id || "none"'
  :data-id='comment.data.id'
)
  .card
    .card-header.text-muted
      i.fa.fa-fw.btn-collapse(
        :class='collapsed ? "fa-plus" : "fa-minus"'
        @click.prevent.stop='toggleCollapsed'
      )
      | &#32;
      UserLink(:username='comment.data.author')
      | &#32;
      // @todo flair
      | &#32;
      TimeAgo(:value='comment.data.created_utc')
      .score.pull-right
        UpVote(:item='comment')
        | &#32;
        Score(:item='comment')
        | &#32;
        DownVote(:item='comment')
    .card-body(v-if="!collapsed")
      ItemHtml(:item='comment')
    .card-footer.text-muted(v-if="!collapsed")
      a(
        :href='`https://www.reddit.com${comment.data.permalink}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-reddit
        span see on reddit
      | &#32;
      nuxt-link(
        :to='comment.data.permalink'
      )
        i.fa.fa-fw.fa-external-link
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
        i.fa.fa-fw.fa-level-up
        span parent
      | &#32;
      nuxt-link(
        v-if='linkTo'
        :to='linkTo'
      )
        i.fa.fa-fw.fa-level-up
        span full comments
      | &#32;
      span.btn-edit-toggle(
        v-if='isAuthor'
        @click.prevent.stop='showEdit^=true'
      )
        i.fa.fa-fw.fa-edit
        span edit
      span.btn-reply-toggle(
        @click.prevent.stop='showReply^=true'
      )
        i.fa.fa-fw.fa-reply
        span reply
      | &#32;
      //- HideButton(:item='comment')
      //- | &#32;
      RemoveButton(:item='comment')
      | &#32;
      DeleteButton(:item='comment' v-if='isAuthor')
      | &#32;
      //- GiveGoldButton(:item='comment' v-if='!isAuthor')
      //- | &#32;
      ReportButton(:item='comment' v-if='!isAuthor')
      | &#32;
      CrossPostButton(:item='comment')
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-code
        span see source
    CommentForm(
      v-if="showReply && !collapsed"
      :parent='comment'
      @updated-comment='onCommentUpdated'
      @close='showReply = false'
    )
    CommentForm(
      v-if="showEdit && !collapsed"
      :comment='comment'
      @created-comment='onCommentCreated'
      @close='showEdit = false'
    )
    pre(v-if="showSource && !collapsed")
      tt: small(v-text="comment.data")
  CommentTree(
    v-if='showReplies && !collapsed'
    :comments='comment.data.replies'
  )
</template>

<script>
import CommentForm from '~/components/CommentForm';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import HideButton from '~/components/HideButton';
import ItemHtml from '~/components/ItemHtml';
import RemoveButton from '~/components/RemoveButton';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';

export default {
  name: 'CommentEntry',
  components: {
    CommentForm,
    CrossPostButton,
    DeleteButton,
    DownVote,
    HideButton,
    ItemHtml,
    RemoveButton,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
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
      collapsed: false,
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
        return '/' + permalink.replace(id, parent_id.slice(3));
      }
      return null;
    },
    linkTo() {
      const { parent_id, permalink, link_id, id } = this.comment.data;
      if (parent_id && parent_id !== link_id && permalink) {
        return permalink.replace(`/${id}/`, '/');
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
    showSource: makeOpenHelper('source'),
    showReply: makeOpenHelper('reply'),
    showEdit: makeOpenHelper('edit'),
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
  },
};

function makeOpenHelper(key) {
  return {
    get() {
      return this.open === key;
    },
    set(value) {
      if (value) {
        this.open = key;
      } else if (this.open === key) {
        this.open = null;
      }
    },
  };
}
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
