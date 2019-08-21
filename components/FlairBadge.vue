<template lang="pug">
  b-badge(
    v-if='text'
    :class='cssclass'
    :style='style'
    v-text='text'
  )
  b-badge.no-flair(v-else-if='showNone')
    | (no flair)
  span.no-flair(v-else)
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'FlairBadge',
  props: {
    type: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: null,
    },
    showNone: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      promptingFlair: false,
    };
  },
  computed: {
    canEditFlair() {
      const { type, item } = this;
      if (get(item.data, 'user_can_flair_in_sr')) {
        return true;
      }
      if (type === 'user' && get(item.data, 'can_assign_user_flair')) {
        return true;
      }
      if (type === 'link' && get(item.data, 'can_assign_link_flair')) {
        return true;
      }
      return false;
    },
    text() {
      const flair = get(this.item.data, `${this.type}_flair_text`);
      if (flair) return flair;
      return flair;
    },
    cssclass() {
      const arr = [];
      arr.push(get(this.item.data, `${this.type}_flair_css_class`));
      if (this.canEditFlair) {
        arr.push('cursor-pointer');
      }
      return arr;
    },
    style() {
      const styles = {};
      const textcolor = get(this.item.data, `${this.type}_flair_text_color`);
      const bgcolor = get(
        this.item.data,
        `${this.type}_flair_background_color`,
      );
      if (textcolor) {
        styles.color = textcolor;
      }
      if (bgcolor) {
        styles.backgroundColor = bgcolor;
      }
      return styles;
    },
  },
  methods: {
    promptFlair($event) {
      this.promptingFlair = true;
    },
  },
};
</script>

<style lang="sass"></style>
