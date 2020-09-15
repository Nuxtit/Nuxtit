<template lang="pug">
  .post-image
    ItemHtml(v-if="post.data.is_self" :item="post")
    video.img-fluid(v-else-if="isRedditVideo" preload="auto" autoplay="false" loop="loop" controls)
      source(:src="post.data.secure_media.reddit_video.fallback_url" type="video/mp4")
      source(:src="post.data.secure_media.reddit_video.hls_url" type="application/x-mpegURL")
    video.img-fluid(v-else-if="isImgurVideo" preload="auto" autoplay="false" loop="loop" controls)
      source(:src="imgurMp4Src" type="video/mp4")
      source(:src="imgurSrc" type="video/gifv")
    span(v-else-if="isPostHintVideo && post.data.secure_media_embed && post.data.secure_media_embed.content"
      v-html="post.data.secure_media_embed.content")
    span(v-else-if="isOembed"
      v-html="post.data.secure_media.oembed.html")
    span(v-else-if="imgurAlbumId && albumData === null")
      Loading
    span(v-else-if="imgurAlbumId && albumData !== false")
      ImgurAlbum(:album="albumData")
    span(v-else-if="imgurAlbumId && albumData === false && post.data.media_embed && post.data.media_embed.content")
      tt imgurAlbumId && post.data.media_embed.content
      div(v-html='post.data.media_embed.content')
    span(v-else-if="redditGallery")
      RedditGallery(:album="redditGallery")
    b-img(
      v-else-if="imageSrc"
      :src="imageSrc"
      :alt="post.data.title"
      fluid
    )
    span(v-else-if="post.data.thumbnail === 'image'")
      | image
    span(v-else-if="post.data.thumbnail === 'default'" title="default")
      i.fa.fa-fw.fa-btn.fa-5x.fa-question-circle-o
    span(v-else-if="post.data.thumbnail === 'self'" title="self")
      i.fa.fa-fw.fa-btn.fa-5x.fa-doc-text
    span(v-else-if="post.data.thumbnail === 'spoiler'" title="spoiler")
      i.fa.fa-fw.fa-btn.fa-5x.fa-question-circle-o
    span(v-else) NO_THUMB
</template>

<script>
import includes from 'lodash/includes';
import map from 'lodash/map';
import Loading from '~/components/Loading';
import ImgurAlbum from '~/components/ImgurAlbum';
import ItemHtml from '~/components/ItemHtml';
import RedditGallery from '~/components/RedditGallery';
import fetchImgurAlbum from '~/lib/imgur/fetchImgurAlbum';
import getPostImageSrc from '~/lib/getPostImageSrc';
import getImgurAlbumId from '~/lib/imgur/getImgurAlbumId';
import get from 'lodash/get';
import bImg from 'bootstrap-vue/es/components/image/img';

export default {
  name: 'PostImage',
  components: {
    bImg,
    ImgurAlbum,
    ItemHtml,
    RedditGallery,
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
  computed: {
    imgurAlbumId() {
      const imgurAlbumId = getImgurAlbumId(this.post);
      // console.log('imgurAlbumId', imgurAlbumId);
      return imgurAlbumId;
    },
    imageSrc() {
      return getPostImageSrc(this.post);
    },
    isImgurVideo() {
      const { imageSrc } = this;
      if (includes(imageSrc, '//i.imgur.com/') && imageSrc.endsWith('.gifv')) {
        return true;
      }
      if (
        includes(this.post.data.url, '//i.imgur.com/') &&
        this.post.data.url.endsWith('.gifv')
      ) {
        return true;
      }
      return false;
    },
    isRedditVideo() {
      return (
        this.post.data.secure_media && this.post.data.secure_media.reddit_video
      );
    },
    redditGallery() {
      const get_gallery = post => {
        const media_metadata =
          (post.data && post.data.media_metadata) || post.media_metadata;
        if (!media_metadata && typeof media_metadata === 'object') return null;

        for (let key in media_metadata) {
          const e = media_metadata[key];
          if (media_metadata[key] && media_metadata[key].status) {
            return {
              images: Object.values(media_metadata),
            };
          }
          break;
        }
        return null;
      };
      return (
        get_gallery(this.post) ||
        map(this.post.data.crosspost_parent_list, get_gallery)[0] ||
        null
      );
    },
    isOembed() {
      if (
        this.post.data.secure_media &&
        this.post.data.secure_media.oembed &&
        this.post.data.secure_media.oembed.html
      ) {
        if (
          this.post.data.post_hint === 'link' &&
          this.post.data.secure_media.type === 'twitter.com'
        ) {
          return true;
        }
        if (this.post.data.secure_media.type === 'gfycat.com') {
          return true;
        }
      }
      return false;
    },
    imgurMp4Src() {
      const { imageSrc } = this;
      if (includes(imageSrc, '//i.imgur.com/') && imageSrc.endsWith('.gifv')) {
        return this.imageSrc.replace('gifv', 'mp4');
      }
      if (
        includes(this.post.data.url, '//i.imgur.com/') &&
        this.post.data.url.endsWith('.gifv')
      ) {
        return this.post.data.url.replace('gifv', 'mp4');
      }
      return null;
    },
    isPostHintVideo() {
      return includes(this.post.data.post_hint, 'video');
    },
  },
  watch: {
    imgurAlbumId: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          fetchImgurAlbum(newValue).then(
            res => {
              this.albumData = res.data;
              console.log('newAlbumData', res.data);
            },
            err => {
              this.albumData = false;
              this.$sentry.captureError(err);
            },
          );
        }
      },
    },
  },
};
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer;
</style>
