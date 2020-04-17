<template lang="pug">
div
  .row
    .col-xs-12
      span.badge.badge-danger(v-if='post.deleted') deleted
      span.badge.badge-secondary(v-text='post.type')
      span.badge.badge-secondary(v-text='post.state')
      TimeAgo(v-if='post.timestamp' :value='post.timestamp')
  .row
    .col-sm-7.col-md-6.col-lg-4.col-xl-3
      div(v-for="photo in photos" :key="photo.thumbnail")
        a(
          target="_blank"
          :href="photo.href"
        )
          img(:src="photo.thumbnail")
    .col-sm-5.col-md-6.col-lg-8.col-xl-9
      div
        a(
          target="_blank"
          :href="post.post_url"
        )
          i.fa.fa-fw.fa-link-ext
        | &#32;
        span
          | {{ post.blog_name }}
        | &#32;
        code {{ post.state }}
        | &#32;
        span
          | note_count:&#32;
          code {{ post.note_count }}
      div(v-if="post.scheduled_publish_time")
        label: code scheduled_publish_time:
        | &nbsp;
        TimeAgo(:value="parseInt(post.scheduled_publish_time)")
      div(v-if="post.scheduled_publish_time")
        label: code created_at:
        | &nbsp;
        TimeAgo(:value="post.timestamp")
      div
        .form-group.row
          label.col-sm-2.col-form-label state
          b-select.form-control.col-sm-10.r-select(
            name="state"
            v-model="dirty.state"
            :options="$options.fields.state.options"
          )
        .form-group.row
          label.col-sm-2.col-form-label caption
          b-form-textarea.col-sm-10(name="caption" v-model="dirty.caption" :rows="3")
        .form-group.row
          label.col-sm-2.col-form-label tags
          b-form-input.col-sm-10(v-model="dirty.tags")
        .form-group.row
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
      tt: code {{ { tags: post.tags, caption: post.caption } }}
      ShowSource(:value="{ tags: post.tags, caption: post.caption }")
      ShowSource(:value="post")
      ShowSource(:value="{ states: fields.states || null }")
      ShowSource(:value="{ dirty }")
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import fields from '~/lib/tumblr/fields';
import { BindSettings } from '~/lib/settings';
import { mapActions, mapGetters } from 'vuex';
import TimeAgo from '~/components/TimeAgo';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';

export default {
  name: 'TumblrPostRow',
  components: {
    bFormTextarea,
    bFormInput,
    TimeAgo,
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
  },
};

function trim(t) {
  return t.trim();
}

function freshDirty(post) {
  return {
    state: post.state,
    caption: post.caption,
    tags: (post.tags || []).join(', '),
  };
}
</script>
