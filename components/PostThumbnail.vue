<template lang="pug">
  .posts-thumbnail
    span(v-if="!imageSrc && post.data.thumbnail === 'image'")
      | image
    span(v-else-if="!imageSrc && post.data.thumbnail === 'default'" title="default")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    span(v-else-if="post.data.thumbnail === 'self'" title="self")
      i.fa.fa-fw.fa-5x.fa-doc-text
    span(v-else-if="post.data.thumbnail === 'spoiler'" title="spoiler")
      i.fa.fa-fw.fa-5x.fa-question-circle-o
    span.cursor-pointer(
      v-else-if="post.data.thumbnail === 'nsfw'" title="nsfw"
      @click.prevent.default='$emit("expand")'
    )
      i.fa.fa-fw.fa-5x.fa-user-secret
    img.cursor-pointer(
      v-else-if="imageSrc"
      :class='imageSrc === post.data.url ? "max-108-mh-144" : null'
      :src="imageSrc"
      :alt="post.data.title"
      @click.prevent.default='$emit("expand")'
    )
    span(v-else) NO_THUMB
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import getPostThumbnailSrc from '~/lib/getPostThumbnailSrc';

export default {
  name: 'PostThumbnail',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      return getPostThumbnailSrc(this.post);
    },
  },
  // watch: {
  //   imageSrc: {
  //     immediate: true,
  //     handler(newValue) {
  //       console.log('imageSrc', { newValue });
  //     },
  //   },
  // },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;

.max-108-mh-144
  max-width: 108px;
  max-height: 144px;
</style>
