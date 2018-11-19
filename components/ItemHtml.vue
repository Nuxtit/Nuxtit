<template lang="pug">
  .item-html(v-html='html')
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'ItemHtml',
  props: {
    item: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
  computed: {
    html() {
      let html =
        this.value ||
        get(this.item, 'data.body_html') ||
        get(this.item, 'data.selftext_html') ||
        '';
      return html;
    },
  },
};
</script>

<style lang="sass">
.item-html
  blockquote
    padding-left: 0.6666rem;
    margin-left: 1.3333rem;
    // hopefully this is good on all future themes
    border-left: 1px solid darken(white, 50%);
</style>
