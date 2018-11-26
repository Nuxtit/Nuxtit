<template lang="pug">
  .comment-tree.zero-messages(v-if="zeroComments")
    | No messages.
  .comment-tree.has-messages(v-else)
    template(
      v-for='message in messages.data.children'
    )
      MessageEntry(
        v-if='message.kind'
        :message='message'
        :key='message.data.id'
      )
      .text-danger(v-else)
        | unknown entry type {{ message.kind }}
</template>

<script>
import MessageCollection from '~/mixins/MessageCollection';
import MessageEntry from '~/components/MessageEntry';

export default {
  name: 'MessageTree',
  components: {
    MessageEntry,
  },
  mixins: [MessageCollection],
  props: {
    messages: {
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
      this.messages.data.children = this.messages.data.children.concat(
        children,
      );
    },
    removeMore(moreItem) {
      this.messages.data.children = this.messages.data.children.filter(c => {
        if (c.kind !== 'more') return true;
        if (c.data.name !== moreItem.data.name) return true;
        if (c.data.count !== moreItem.data.count) return true;
        return false;
      });
    },
  },
};
</script>

<style lang="sass">
.message-entry
  .message-tree
    padding-left: 1.5rem

.message-tree
  .load-more-messages-entry
  .message-tree
    // padding-left: 1.5rem

  .message-tree
    .message-tree
      border-left: 1px solid darken(white, 50%)
  .message-tree-loaded
    // padding-left: 0rem
</style>
