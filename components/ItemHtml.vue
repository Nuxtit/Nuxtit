<template lang="pug">
  .item-html(v-html='html')
</template>

<script>
import Mark from 'mark.js';
import get from 'lodash/get';
import memoize from 'lodash/memoize';

const highlightRegEx = /'[\s-_a-z0-9?*]*'|"[\s-_a-z0-9?*]*"|[-_a-z0-9?*]*/gim;
const getHighlightTerms = memoize(v => {
  return ((v || '').match(highlightRegEx) || [])
    .filter(v => v && v.trim())
    .filter(v => !v.trim().startsWith('-'))
    .map(v => {
      if (v.startsWith('"') && v.endsWith('"')) {
        return v.slice(1, v.length - 1);
      }
      if (v.startsWith("'") && v.endsWith("'")) {
        return v.slice(1, v.length - 1);
      }
      return v;
    });
});

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
      if (html && (this.$route.query.q || this.$route.query.highlight)) {
        const terms = getHighlightTerms(
          (this.$route.query.q || '') +
            ' ' +
            (this.$route.query.highlight || ''),
        );
        if (terms && terms.length) {
          const div = document.createElement('div');
          div.innerHTML = html;
          const m = new Mark(div);
          m.mark(terms, {
            // @link https://markjs.io/#api
            accuracy: 'complementary',
            acrossElements: true,
            wildcards: 'withSpaces',
          });
          html = div.innerHTML;
        }
      }
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
