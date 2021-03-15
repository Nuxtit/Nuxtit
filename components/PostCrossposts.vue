<template lang="pug">
  b-badge(v-if='crosspostedFrom' v-text="crosspostedFrom")
  b-badge(v-else-if='post.data.num_crossposts > 0') [x-posts: {{ post.data.num_crossposts }}]&#32;
  span(v-else v-show="false")
</template>

<script>
export default {
  name: 'PostCrossposts',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    crosspostedFrom() {
      const { post } = this;
      const list = post && post.data && post.data.crosspost_parent_list;
      const list_len = list && list.length;
      if (!(list_len > 0)) return null;
      const parent = list[0];
      const subreddit = parent && parent.subreddit;
      if (!subreddit) return null;
      if (list_len === 1) {
        return `[x-posted from r/${subreddit}]`;
      }
      return `[x-posted from r/${subreddit}, ${list_len - 1} more]`;
    },
  },
};
</script>
