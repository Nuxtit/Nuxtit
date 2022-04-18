<template lang="pug">
div.card: .card-body
  .row
    .col-xs-12
      span.badge.badge-danger(v-if='post.deleted') deleted
      span.badge.badge-secondary(v-text='post.type')
      span.badge.badge-secondary(v-text='post.state')
      TimeAgo(v-if='post.timestamp' :value='post.timestamp')
  .row
    .col-sm-7.col-md-6.col-lg-8.col-xl-9
      .b-info(v-if='post.type === "text"')
        ItemHtml(:value='post.body')
      .b-info(v-else-if='post.type === "chat"')
        p(v-for='d in post.dialogue')
          nuxt-link(:to='`/tumblr/${d.name}`')
            | {{ d.label }}
          | &#32;{{ d.phrase }}
      .b-info(v-else-if='post.type === "answer"')
        p Question:
        ItemHtml(:value='post.question')
        p Answer:
        ItemHtml(:value='post.answer')
      TumblrAlbum(
        v-else-if='post.type === "photo" || post.type === "link"'
        :post="post"
      )
      div(v-else-if='post.type === "video"')
        ItemHtml(v-if='post.caption' :value='post.caption')
        div(
          v-if="videoSize"
          v-html='post.player.find(item => item.width === videoSize).embed_code'
        )
        div(v-else)
          img.img.img-fluid(
            v-if='post.thumbnail_url'
            :src='post.thumbnail_url'
            alt='youtube thumbnail'
            @click='videoSize = post.player.reduce((carry, item) => Math.max(item.width, carry), 0) || null'
          )
          br
          .badge.badge-info(
            v-for='player in post.player'
            v-text='player.width'
            @click='videoSize = player.width'
          )
      tt(v-else) UNKNOWN TYPE {{ post.type }}
    .col-sm-5.col-md-6.col-lg-4.col-xl-3
      div
        a(
          target="_blank"
          :href="post.post_url"
        )
          i.fa.fa-fw.fa-link-ext
        | &#32;
        a(
          :to='`/tumblr/${post.blog_name}`' 
        )
          template(v-if='post.blog')
            | {{post.blog.title}} ({{ post.blog_name }})
          template(v-else) {{ post.blog_name }}
        p(
          v-if='post.blog && post.blog.description'
          v-text='post.blog.description'
        )
        span.badge.badge-info {{ post.type }}
        | &#32;
        code {{ post.state }}
        | &#32;
        span
          | note_count:&#32;
          code {{ post.note_count }}
      div(v-if="post.timestamp")
        label: code timestamp:
        | &nbsp;
        TimeAgo(:value="parseInt(post.timestamp)")
      div(v-if="post.scheduled_publish_time")
        label: code scheduled_publish_time:
        | &nbsp;
        TimeAgo(:value="parseInt(post.scheduled_publish_time)")
      div(v-if="post.scheduled_publish_time")
        label: code created_at:
        | &nbsp;
        TimeAgo(:value="post.timestamp")
      div(v-if="canEdit")
        .form-group.row
          label.col-xs-12.col-form-label type
          b-form-input.col-xs-12(v-model="post.type" disabled)
        .form-group.row
          label.col-xs-12.col-form-label state
          b-select.form-control.col-xs-12.r-select(
            name="state"
            v-model="dirty.state"
            :options="$options.fields.state.options"
          )
        .form-group.row(v-if="dirty.title")
          label.col-xs-12.col-form-label title
          b-form-textarea.col-xs-12(name="title" v-model="dirty.title" :rows="3")
        .form-group.row
          label.col-xs-12.col-form-label caption
          b-form-textarea.col-xs-12(name="caption" v-model="dirty.caption" :rows="3")
        .form-group.row
          label.col-xs-12.col-form-label tags
          b-form-input.col-xs-12(v-model="dirty.tags")
        .form-group.row
          label.col-xs-12.col-form-label link_url
          b-form-input.col-xs-12(v-model="dirty.link_url")
          p: a(
            v-if="dirty.link_url"
            :href="updateIfOutdated(dirty.link_url)"
            v-text="dirty.link_url"
            target="_blank"
            rel="noreferrer"
          )
        .form-group.row(v-if="dirty.url")
          label.col-xs-12.col-form-label url
          b-form-input.col-xs-12(v-model="dirty.url")
          p: a(
            v-if="dirty.url"
            :href="updateIfOutdated(dirty.url)"
            v-text="dirty.url"
            target="_blank"
            rel="noreferrer"
          )
        .form-group.row.btn-group
          button.btn.btn-primary.mb-2(
            v-disabled="noChanges || updating"
            type="submit"
            @click.prevent.stop="updatePost"
          )
            i.fa.fa-fw.fa-spinner.fa-spin(v-if="updating")
            i.fa.fa-fw.fa-floppy(v-else)
            | Update
          button.btn.btn-danger.mb-2(
            v-disabled="deleting || post.deleted"
            type="button"
            @click.prevent.stop="deleteTumblrPost"
          )
            i.fa.fa-fw.fa-spinner.fa-spin(v-if="deleting")
            i.fa.fa-fw.fa-trash(v-else)
            | Delete
      div(v-else)
        p Caption:
          ItemHtml(:value='post.caption')
        p Tags: {{post.tags}}
      div
        button.btn.btn-secondary.mb-2(
          @click.stop.prevent='showSource^=true'
        )
          i.fa.fa-fw.fa-code
          | Source
      ShowSource(v-if="showSource" :value="{ dirty, post }")
      QuickReblogButton(:post="post" queue)
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import fields from '~/lib/tumblr/fields';
import { BindSettings } from '~/lib/settings';
import { mapActions, mapGetters } from 'vuex';
import TimeAgo from '~/components/TimeAgo';
import ItemHtml from '~/components/ItemHtml';
import TumblrAlbum from '~/components/Tumblr/TumblrAlbum';
import QuickReblogButton from '~/components/Tumblr/QuickReblogButton';
import {BFormInput} from 'bootstrap-vue/esm/components/form-input';
import {BFormTextarea} from 'bootstrap-vue/esm/components/form-textarea';

export default {
  name: 'TumblrPostRow',
  components: {
    BFormTextarea,
    BFormInput,
    ItemHtml,
    TimeAgo,
    TumblrAlbum,
    QuickReblogButton,
  },
  fields,
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleting: false,
      updating: false,
      dirty: freshDirty(this.post),
      showSource: false,
      videoSize: null,
    };
  },
  computed: {
    ...BindSettings(['tumblrSelectedBlog', 'tumblrDefaultTags']),
    ...mapGetters('tumblr', ['blogs']),
    photos() {
      /* eslint-disable */
      return map(this.post.photos, p => ({
        href: get(p, 'original_size.url'),
        thumbnail: get(find(p.alt_sizes, p => p.width <= 250), 'url'),
      }))
    },
    noChanges() {
      return JSON.stringify(this.dirty) === JSON.stringify(freshDirty(this.post));
    },
    canEdit() {
      return this.blogs.findIndex(b => b.name === this.post.blog_name) !== -1;
    },
  },
  methods: {
    ...mapActions('tumblr', ['updateBlogPost', 'deletePost']),
    async updatePost($event) {
      try {
        this.updating = true;
        this.updateBlogPost({
          blogName: this.post.blog_name,
          options: {
            id: this.post.id,
            ...this.dirty,
          },
        });
        // this.post
      } finally {
        this.updating = false;
      }
    },
    async deleteTumblrPost($event) {
      try {
        this.deleting = true;
        this.deletePost({
          blogName: this.post.blog_name,
          options: this.post.id,
        });
        this.post.deleted = true;
      } finally {
        this.deleting = false;
      }
    },
    updateIfOutdated (link_url) {
      if (link_url) {
        if (link_url.startsWith('https://redusa.netlify.com/')) {
          return link_url.replace('https://redusa.netlify.com', window.location.origin)
        }
        if (link_url.startsWith('https://sappit.netlify.com/')) {
          return link_url.replace('https://sappit.netlify.com', window.location.origin)
        }
        if (link_url.startsWith('https://nuxtit.netlify.app/')) {
          return link_url.replace('https://nuxtit.netlify.app', window.location.origin)
        }
        if (link_url.startsWith('https://www.reddit.com/')) {
          return link_url.replace('https://www.reddit.com', window.location.origin)
        }
        if (link_url.startsWith('https://old.reddit.com/')) {
          return link_url.replace('https://old.reddit.com', window.location.origin)
        }
      }
    },
  },
};

function trim(t) {
  return t.trim();
}

function freshDirty(post) {
  return {
    state: post.state,
    caption: post.caption,
    link_url: post.link_url,
    url: post.url,
    tags: (post.tags || []).join(', '),
  };
}
</script>
