<template lang="pug">
  .mixed-list
    template(
      v-if='itemsChildren'
      v-for='item in itemsChildren'
    )
      CommentEntry(
        v-if='item.kind === "t1"'
        :comment='item'
        :key='item.id'
      )
      PostEntry(
        v-else-if='item.kind === "t3"'
        :post='item'
        :key='item.id'
      )
      SubredditEntry(
        v-else-if='item.kind === "t5"'
        :subreddit='item'
        :key='item.id'
      )
      PushshiftMissingEntry(
        v-else-if="item.redditItemMissing"
        :item='item'
        :key='item.id'
      )
      div.alert.alert-danger(
        v-else
        :key='item.id'
      )
        | Error: unsupported "kind" {{ item.kind }}
        | Error: unsupported "kind" {{ {item} }}
</template>

<script>
import get from 'lodash/get';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import PushshiftMissingEntry from '~/components/PushshiftMissingEntry';
import SubredditEntry from '~/components/SubredditEntry';

export default {
  name: 'MixedList',
  components: {
    CommentEntry,
    PostEntry,
    PushshiftMissingEntry,
    SubredditEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
  computed: {
    itemsChildren() {
      return get(this.items, 'children') || [];
    },
  },
};
</script>

<style lang="sass"></style>
