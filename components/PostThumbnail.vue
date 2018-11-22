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
    span.cursor-pointer(
      v-else-if="post.data.thumbnail === 'nsfw'" title="nsfw"
      @click.prevent.default='$emit("expand")'
    )
      i.fa.fa-fw.fa-5x.fa-user-secret
    img.cursor-pointer(
      v-else-if="imageSrc"
      :src="imageSrc"
      :alt="post.data.title"
      @click.prevent.default='$emit("expand")'
    )
    span(v-else) NO_THUMB
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';

export default {
  name: 'PostThumbnail',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  srcPaths: [
    // @todo is this a good idea?
    // 'preview.images.0.variants.mp4.source.url',
    'preview.images.0.variants.gif.source.url',
    'preview.images.0.source.url',
    'preview.images.0.resolutions.0.url',
    'url',
  ],
  computed: {
    imageSrc() {
      let src = this.post.data.thumbnail;
      if (src && src.startsWith('https://')) {
        return src;
      }
      for (let i = 0, len = this.$options.srcPaths.length; i < len; i++) {
        src = get(this.post.data, this.$options.srcPaths[i]);
        if (src && src.startsWith('https://')) {
          return src;
        }
      }
      return null;
    },
  },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;
</style>
