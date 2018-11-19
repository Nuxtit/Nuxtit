<template lang="pug">
  .posts-thumbnail
    span(v-if="!imageSrc && post.data.thumbnail === 'image'")
      | image
    span(v-else-if="post.data.thumbnail === 'default'" title="default")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    span(v-else-if="post.data.thumbnail === 'self'" title="self")
      i.fa.fa-fw.fa-5x.fa-file-text
    span(v-else-if="post.data.thumbnail === 'spoiler'" title="spoiler")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    b-img(
      v-else-if="imageSrc"
      :src="imageSrc"
      :alt="post.data.title"
      fluid
    )
    span(v-else) NO_THUMB
</template>

<script>
import get from 'lodash/get';
import bImg from 'bootstrap-vue/es/components/image/img';

export default {
  name: 'PostImage',
  components: {
    bImg,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      const source = get(this.post.data, 'preview.images.0.source.url');
      if (source) {
        return source;
      }
      return this.post.data.url;
    },
  },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;
</style>
