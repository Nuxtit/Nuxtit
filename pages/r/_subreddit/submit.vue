<template lang="pug">
  div
    br
    .container
      .alert.alert-primary
        ItemHtml(:value='subreddit.data.submit_text_html')
    br
    .container
      PostForm(
        :subreddit='subreddit'
      )
</template>
<script>
import ItemHtml from '~/components/ItemHtml';
import PostForm from '~/components/PostForm';
export default {
  middleware: ['auth'],
  components: {
    ItemHtml,
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
