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
    span(v-else-if="isImgurVideo")
      video.img-fluid(preload="auto" autoplay="false" loop="loop" controls)
        source(:src="imgurMp4Src" type="video/mp4")
        source(:src="imgurSrc" type="video/gifv")
    span(v-if="isPostHintVideo && post.secure_media_embed && post.secure_media_embed.content"
      v-html="post.secure_media_embed.content")
    span(v-if="post.post_hint === 'link' && post.secure_media && post.secure_media.type === 'twitter.com' && post.secure_media.oembed && post.secure_media.oembed.html"
      v-html="post.secure_media.oembed.html")
    span(v-else-if="imgurAlbumId && albumData === null")
      Loading
    span(v-else-if="imgurAlbumId && albumData !== false")
      ImgurAlbum(album='albumData.data')
    span(v-else-if="imgurAlbumId && albumData === false && post.data.media_embed && post.data.media_embed.content")
      tt imgurAlbumId && post.media_embed.content
      div(v-html='post.data.media_embed.content')
    b-img(
      v-else-if="imageSrc"
      :src="imageSrc"
      :alt="post.data.title"
      fluid
    )
    span(v-else) NO_THUMB
</template>

<script>
import includes from 'lodash/includes';
import Loading from '~/components/Loading';
import ImgurAlbum from '~/components/ImgurAlbum';
import fetchImgurAlbum from '~/lib/imgur/fetchImgurAlbum';
import getPostImageSrc from '~/lib/getPostImageSrc';
import getImgurAlbumId from '~/lib/imgur/getImgurAlbumId';
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
  data() {
    return {
      albumData: null,
    };
  },
  srcPaths: [
    // @todo should we attempt to embed videos?
    // 'preview.images.0.variants.mp4.source.url',
    'preview.images.0.variants.gif.source.url',
    'preview.images.0.source.url',
    'preview.images.0.resolutions.0.url', // @toodo how to get $last instead of zero?
  ],
  computed: {
    imgurAlbumId() {
      return getImgurAlbumId(this.post);
    },
    imageSrc() {
      return getPostImageSrc(this.post);
    },
    isImgurVideo() {
      return (
        includes(this.imageSrc, '//i.imgur.com/') && imageSrc.endsWith('.gifv')
      );
    },
    imgurMp4Src() {
      if (this.isImgurVideo) {
        return this.imageSrc.replace('gifv', 'mp4');
      }
      return null;
    },
    isPostHintVideo() {
      return includes(this.post.data.post_hint, 'video');
    },
  },
  watch: {
    async imgurAlbumId(newValue) {
      if (newValue) {
        fetchImgurAlbum(newValue).then(
          newAlbumData => (albumData = newAlbumData),
          err => {
            if (newValue === this.imgurAlbumId) {
              albumData = false;
              this.$sentry.captureError(err);
            }
          },
        );
      }
    },
  },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;
</style>
