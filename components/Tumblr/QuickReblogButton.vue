<template lang="pug">
  div(v-show='false')
    <!-- @todo select blog -->
</template>

<script>
export default {
  name: 'QuickReblogButton',
  props: {
    post: {
      type: Object,
      required: true,
    },
    queue: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    first() {
      this.index = this.lastIndex;
    },
  },
};
</script>
