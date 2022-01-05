<template lang="pug">
  .comment-tree.zero-comments(v-if="zeroComments")
    | No comments.
  .comment-tree.has-comments(v-else)
    template(
      v-for='comment in comments.children'
    )
      CommentEntry(
        v-if='comment.kind === "t1"'
        :comment='comment'
        :key='comment.id'
      )
      LoadMoreCommentsEntry(
        v-else-if='comment.kind === "more"'
        :item='comment'
        :key='comment.id'
        @append-children='appendChildren'
        @remove-more='removeMore'
      )
      .text-danger(v-else)
        | unknown entry type {{ comment.kind }}
</template>

<script>
import CommentCollection from '~/mixins/CommentCollection';
import CommentEntry from '~/components/CommentEntry';
import LoadMoreCommentsEntry from '~/components/LoadMoreCommentsEntry';

export default {
  name: 'CommentTree',
  components: {
    CommentEntry,
    LoadMoreCommentsEntry,
  },
  mixins: [CommentCollection],
  props: {
    comments: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async collapseAll(value = true) {
      const { $children } = this;
      for (let i = 0, len = $children.length; i < len; i++) {
        if ($children[i] && $children[i].setCollapsed) {
          $children[i].setCollapsed(value);
        }
        if (i % 5 === 100) {
          await null;
        }
      }
    },
    appendChildren(children) {
      this.comments.children = this.comments.children.concat(children);
    },
    removeMore(moreItem) {
      this.comments.children = this.comments.children.filter(c => {
        if (c) {
          if (c.kind !== 'more') return true;
          if (c.name !== moreItem.name) return true;
          if (c.count !== moreItem.count) return true;
        }
        return false;
      });
    },
  },
};
</script>

<style lang="sass">
.comment-entry
  .comment-tree
    padding-left: 1.5rem

.comment-tree
  .load-more-comments-entry
  .comment-tree
    // padding-left: 1.5rem

  .comment-tree
    .comment-tree
      border-left: 1px solid darken(white, 50%)
  .comment-tree-loaded
    // padding-left: 0rem
</style>
