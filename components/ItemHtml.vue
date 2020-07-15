<template lang="pug">
  .item-html(v-html='html' @click="onClick")
</template>

<script>
import Mark from 'mark.js';
import get from 'lodash/get';
import memoize from 'lodash/memoize';

const highlightRegEx = /-{0,1}('[\s-_a-z0-9?*]*'|"([\s-_a-z0-9?*]*)"|[-_a-z0-9?*]*)/gim;
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

const linkRegEx = /<a href="https{0,1}:\/\/(i\.|www\.|np\.|old\.){0,1}reddit\.com\//gim;
const newLink = '<a href="/';

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
      if (
        get(this.item, 'data.body') === '[removed]' &&
        get(this.item, 'pushshiftEntry.body')
      ) {
        html =
          '<div class="alert alert-info">recovered via pushshift</div>' +
          get(this.item, 'pushshiftEntry.body');
      }
      html = html.replace(linkRegEx, newLink);
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
            // accuracy: 'complementary',
            separateWordSearch: false,
            accuracy: 'exactly',
            acrossElements: true,
            wildcards: 'withSpaces',
          });
          html = div.innerHTML;
        }
      }
      return html;
    },
  },
  methods: {
    onClick($event) {
      // console.log($event);
      $event.preventDefault();
      // left click
      const { target, which } = $event;
      if (which === 1 && target && target.tagName === 'A' && target.href) {
        const href = target.getAttribute('href');
        if (href && href[0] === '/' && href[1] !== '/') {
          const resolve = this.$router.resolve(href);
          if (resolve && resolve.resolved) {
            this.$router.push(resolve.resolved);
            return false;
          }
        }
      }
      return true;
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
