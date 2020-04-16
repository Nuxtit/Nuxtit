<template lang="pug">
  .imgur-album.text-center
    h4(v-if='album.title' v-text='album.title')
    p(v-if='album.description' v-text='album.description')
    video.img-fluid(v-if='image && image.animated' preload='auto' autoplay='false' loop='loop' controls)
      source(:src='image.mp4' type='video/mp4')
      source(:src='image.gifv' type='video/gifv')
      source(:src='image.hls' type='application/x-mpegURL')
    img.img-fluid(v-else-if='image' :src='image.link' alt='image.title')
    p(image.title v-text='image.title')
    div(v-if='length > 1' style='position: sticky; bottom: 10px;')
      button.btn.btn-secondary(
        v-disabled='index === 0'
        @click.prevent.stop="first"
      )
        i.fa.fa-fw.fa-btn.fa-to-end.fa-rotate-180
        | First
      button.btn.btn-secondary(
        v-disabled='prevIndex === null'
        @click.prevent.stop="prev"
      )
        i.fa.fa-fw.fa-btn.fa-left-open
        | Prev
      button.btn.btn-secondary(
        v-disabled='nextIndex === null'
        @click.prevent.stop="next"
      )
        i.fa.fa-fw.fa-btn.fa-right-open
        | Next
      button.btn.btn-secondary(
        v-disabled='lastIndex === null'
        @click.prevent.stop="last"
      )
        i.fa.fa-fw.fa-btn.fa-to-end
        | Last
</template>

<script>
export default {
  name: 'ImgurAlbum',
  props: {
    album: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    prevIndex() {
      return this.index > 0 ? this.index - 1 : null;
    },
    nextIndex() {
      return this.index < this.length - 1 ? this.index + 1 : null;
    },
    lastIndex() {
      return this.length > 0 ? this.length - 1 : null;
    },
    length() {
      return (this.album && this.album.images && this.album.images.length) || 0;
    },
    image() {
      return (
        (this.album && this.album.images && this.album.images[this.index]) ||
        null
      );
    },
  },
  methods: {
    first() {
      this.index = 0;
    },
    prev() {
      this.index = this.index - 1;
    },
    next() {
      this.index = this.index + 1;
    },
    last() {
      this.index = this.lastIndex;
    },
  },
};
</script>
