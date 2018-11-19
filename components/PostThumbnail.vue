<template lang="pug">
  .posts-thumbnail
    span(v-if="post.data.thumbnail === 'image'")
      | image
    span(v-else-if="post.data.thumbnail === 'default'" title="default")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    span(v-else-if="post.data.thumbnail === 'self'" title="self")
      i.fa.fa-fw.fa-5x.fa-file-text
    span(v-else-if="post.data.thumbnail === 'spoiler'" title="spoiler")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    span(v-else-if="post.data.thumbnail === 'nsfw'" title="nsfw")
      i.fa.fa-fw.fa-5x.fa-user-secret
    img(
      v-else-if="post.data.thumbnail"
      :src="post.data.thumbnail"
      :alt="post.data.title"
    )
    span(v-else) NO_THUMB
</template>

<script>
export default {
  name: 'PostThumbnail',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
