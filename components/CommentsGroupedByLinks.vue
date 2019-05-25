<template lang="pug">
  .posts-grouped-by-links-list
    .card(v-for='link in links')
      .card-header
        .pull-right
          i.fa.fa-fw.fa-btn.btn-collapse(
            :class='collapsedLinks[link.display_url] ? "fa-plus" : "fa-minus"'
            @click.prevent.stop='toggleLinkCollapse(link)'
          )

        b-badge(
          variant='dark'
          v-text='link.comments ? link.comments.length : "NA"'
        )
        | &#32;
        a.small(
          rel="nofollow"
          target="_blank"
          :href="link.url"
          v-text="link.display_url"
        )
      .card-body(v-if='!collapsedLinks[link.display_url]')
        PushshiftMissingEntry(
          v-if="link.post && link.post.pushshiftMissing"
          :item='link.post'
          :key='link.post.id'
        )
        PostEntry(
          v-else-if="link.post && link.post.data"
          :post='link.post'
          :key='link.post.data.id'
        )
        template(
          v-for='(comment, index) in link.comments'
        )
          PushshiftMissingEntry(
            v-if="comment.pushshiftMissing"
            :item='comment'
            :key='comment.data.id'
          )
          CommentEntry(
            v-else-if="comment && comment.data && comment.data.id"
            :comment='comment'
            :key='comment.data.id'
          )
</template>

<script>
import forEach from 'lodash/forEach';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import PushshiftMissingEntry from '~/components/PushshiftMissingEntry';
import SubredditEntry from '~/components/SubredditEntry';

export default {
  name: 'CommentsGroupedByLinks',
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
      let items = this.items.data.children;
      items = items.filter(p => p.data.hidden !== true);
      items = items.filter(p => p.data.author !== '[deleted]');
      return items.reduce((carry, comment) => {
        const link_id = comment.data.link_id;
        const url = comment.data.url || comment.data.permalink;
        if (!carry[link_id]) {
          carry[link_id] = {
            link_id,
            url,
            display_url: urlToDisplayUrl(url),
            comments: [],
            post: null,
          };
        }
        if (!carry[link_id].post) {
          carry[link_id].post = comment.postEntry || null;
        }
        carry[link_id].comments.push(comment);
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
            l.comments.filter(p => {
              if (p.data.hidden === true) return false;
              if (p.data.saved === true) return false;
              if (p.data.likes === true) return false;
              if (p.data.likes === false) return false;
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
