<template lang="pug">
  PostForm(
    :subreddit='subreddit'
  )
</template>
<script>
import PostForm from '~/components/PostForm';
export default {
  components: {
    PostForm,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
