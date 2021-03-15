<template lang="pug">
  .reddit-gallery.text-center
    p(v-if='!image') missing image metadata
    p(v-else-if='image.status != "valid"') image status: {{ image.status }}
    picture.img-fluid(v-else-if='image.e === "Image"')
      source(
        v-for="p in sortedThumbs(image.p)"
        :media='p.x ? `(min-width:${p.x}px)` : null'
        :srcset='p.u'
      )
      img(:src='image.s.u')
    p(v-else) unsupported image: {{ {image} }}
    p.small(v-if="image && image.s && image.s.u")
      a(:href="image.s.u" target="_blank")
        | fullsize {{ image.s.x }}&times{{ image.s.y }}
    .position-sticky(v-if='length > 1' style='bottom: 10px;')
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
import sortBy from 'lodash/sortBy';

export default {
  name: 'RedditGallery',
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
      return this.imageList.length || 0;
    },
    imageList() {
      const list = (this.album && this.album.images) || [];

      return list;
    },
    image() {
      return this.imageList[this.index] || null;
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
    sortedThumbs(list) {
      return sortBy(list, p => -p.x);
    },
  },
};
</script>
