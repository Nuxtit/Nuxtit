<template lang="pug">
  .posts-grouped-by-links-list
    .card(v-for='link in links')
      .card-header.position-sticky(style="top: 0; z-index: 1;")
        .pull-right
          i.fa.fa-fw.fa-btn.btn-collapse(
            :class='collapsedLinks[link.display_url] ? "fa-plus" : "fa-minus"'
            @click.prevent.stop='toggleLinkCollapse(link)'
          )
        b-badge(
          variant='dark'
          v-text='link.posts ? link.posts.length : "NA"'
        )
        | &#32;
        a.small(
          rel="nofollow"
          target="_blank"
          :href="link.url"
          v-text="link.display_url"
        )
      .card-body(v-if='!collapsedLinks[link.display_url]')
        PostEntry(
          v-for='(post, index) in link.posts'
          :post='post'
          :key='post.data.id'
          :show-thumbnail='index===0'
        )
</template>

<script>
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import PushshiftMissingEntry from '~/components/PushshiftMissingEntry';
import SubredditEntry from '~/components/SubredditEntry';

// const notHidden = p => p.data.hidden !== true;
const notAuthorDeleted = p => p.data.author !== '[deleted]';

export default {
  name: 'PostsGroupedByLinks',
  components: {
    CommentEntry,
    PostEntry,
    PushshiftMissingEntry,
    SubredditEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collapsedLinks: {},
    };
  },
  computed: {
    links() {
      let items = get(this.items, 'data.children') || [];
      // items = items.filter(notHidden);
      items = items.filter(notAuthorDeleted);
      return items.reduce((carry, post) => {
        const url = post.data.url || post.data.permalink;
        if (!carry[url]) {
          carry[url] = {
            url,
            display_url: urlToDisplayUrl(url),
            posts: [],
          };
        }
        carry[url].posts.push(post);
        return carry;
      }, {});
    },
  },
  watch: {
    links: {
      immediate: true,
      handler(links) {
        forEach(links, l => {
          // autocollapse link section if all items have been interacted with
          this.collapsedLinks[l.display_url] =
            l.posts.filter(p => {
              if (p.data.hidden === true) return false;
              if (p.data.saved === true) return false;
              if (p.data.likes !== null) return false;
              return true;
            }).length === 0;
        });
      },
    },
  },
  methods: {
    toggleLinkCollapse(link) {
      this.collapsedLinks = {
        ...this.collapsedLinks,
        [link.display_url]: !this.collapsedLinks[link.display_url],
      };
    },
  },
};

const startRegex = /^(http|https|ftp):\/\/(www[0-9]{0,3}\.){0,1}/i;
function urlToDisplayUrl(url) {
  return url.replace(startRegex, '').slice(0, 128);
}
</script>

<style lang="sass">
.btn-collapse
  cursor: pointer;
</style>
