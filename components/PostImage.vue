<template lang="pug">
  .posts-thumbnail
    span(v-if="!imageSrc && post.data.thumbnail === 'image'")
      | image
    span(v-else-if="!imageSrc && post.data.thumbnail === 'default'" title="default")
      i.fa.fa-fw.fa-btn.fa-5x.fa-question-circle-o
    span(v-else-if="!imageSrc && post.data.thumbnail === 'self'" title="self")
      i.fa.fa-fw.fa-btn.fa-5x.fa-doc-text
    span(v-else-if="!imageSrc && post.data.thumbnail === 'spoiler'" title="spoiler")
      i.fa.fa-fw.fa-btn.fa-5x.fa-question-circle-o
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
  srcPaths: [
    // @todo should we attempt to embed videos?
    // 'preview.images.0.variants.mp4.source.url',
    'preview.images.0.variants.gif.source.url',
    'preview.images.0.source.url',
    'preview.images.0.resolutions.0.url', // @toodo how to get $last instead of zero?
  ],
  computed: {
    imageSrc() {
      let src;
      let path;
      for (let i = 0, len = this.$options.srcPaths.length; i < len; i++) {
        path = this.$options.srcPaths[i];
        src = get(this.post.data, path);
        if (src && src.startsWith('https://')) {
          return src;
        }
      }
      for (let i = 0, len = this.$options.srcPaths.length; i < len; i++) {
        path = 'crosspost_parent_list.0.' + this.$options.srcPaths[i];
        src = get(this.post.data, path);
        if (src && src.startsWith('https://')) {
          return src;
        }
      }
      src = this.post.data.url;
      if (src && src.startsWith('https://')) {
        return src;
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
