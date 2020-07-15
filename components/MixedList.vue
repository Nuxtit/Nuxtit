<template lang="pug">
  .mixed-list
    template(
      v-if='itemsChildren'
      v-for='item in itemsChildren'
    )
      CommentEntry(
        v-if='item.kind === "t1"'
        :comment='item'
        :key='item.data.id'
      )
      PostEntry(
        v-else-if='item.kind === "t3"'
        :post='item'
        :key='item.data.id'
      )
      SubredditEntry(
        v-else-if='item.kind === "t5"'
        :subreddit='item'
        :key='item.data.id'
      )
      PushshiftMissingEntry(
        v-else-if="item.pushshiftMissing"
        :item='item'
        :key='item.data.id'
      )
      div.alert.alert-danger(
        v-else
        :key='item.data.id'
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
      return get(this.items, 'data.children') || [];
    },
  },
};
</script>

<style lang="sass"></style>
