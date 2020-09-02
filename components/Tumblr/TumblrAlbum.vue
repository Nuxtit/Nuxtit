<template lang="pug">
  span(v-if='!image') NO_IMAGE
  .tumblr-image.text-center(v-else)
    img.img-fluid(
      :src='image.original_size.url'
      :alt='image.caption'
    )
    p(v-if='image.caption' v-text='image.caption')
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
    div(v-if='length > 1')
      template(
        v-for='thumb in post.photos'
      )
      img.img-fluid(
        v-if='thumb && thumb.alt_sizes && thumb.alt_sizes.length > 0'
        :src='thumb.alt_sizes[thumb.alt_sizes.length - 1].url'
        alt='thumb.caption'
      )

</template>

<script>
export default {
  name: 'TumblrAlbum',
  props: {
    post: {
      type: Object,
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
      return (this.post && this.post.photos && this.post.photos.length) || 0;
    },
    image() {
      return (
        (this.post && this.post.photos && this.post.photos[this.index]) || null
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

// div(v-for="photo in photos" :key="photo.thumbnail")
//   a(
//     target="_blank"
//     :href="photo.href"
//   )
//     img(:src="photo.thumbnail")
</script>
