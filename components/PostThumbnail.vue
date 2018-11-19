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
  computed: {
    imageSrc() {
      const { thumbnail, preview } = this.post.data;
      if (thumbnail) {
        if (thumbnail.startsWith('https://')) {
          return thumbnail;
        }
      }
      if (preview && preview.images && preview.images.length) {
        for (let i = 0, p; i < preview.images.length; i++) {
          p = find(get(preview.images[i], 'resolutions'), p => {
            return p && p.url;
          });
          if (p) {
            return p.url;
          }
          const p = find(get(preview.images[i], 'source'), p => {
            return p && p.url;
          });
          if (p) {
            return p.url;
          }
        }
      }
    },
  },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;
</style>
