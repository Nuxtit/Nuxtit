<template lang="pug">
  .mixed-list
    template(v-for='item in items.data.children')
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
      div(
        v-else
        :key='item.data.id'
      )
        | Error: unsupported "kind" {{ item.kind }}
</template>

<script>
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';

export default {
  name: 'MixedList',
  components: {
    CommentEntry,
    PostEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="sass">
</style>
