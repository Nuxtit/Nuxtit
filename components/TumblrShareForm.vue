<template lang="pug">
  .post-form.container
    .form-group.row
      label.col-6 Blog
      b-select.col-6(
        v-model="selected_blog"
        :name="selected_blog"
        :options='blogNames'
      )
    div(v-if="selected_blog && selectedBlog")
      .form-group.row(
        v-for="(field, key) in $options.fields"
        v-if="!field.kinds || field.kinds.includes(dirty.kind)"
        :key="key"
      )
        label.col-6(v-text="key")
        b-select.col-6(
          v-if="field.type === 'select'"
          v-model="dirty[key]"
          :name="key"
          :options='field.options'
        )
        b-form-input.col-6(
          v-else-if="field.type === 'textarea'"
          v-model="dirty[key]"
          :name="key"
          :rows="3"
        )
        b-form-input.col-6(
          v-else
          v-model="dirty[key]"
          :name="key"
        )
        .form-text.text-muted(
          v-if="field.description && dirty.kind && typeof field.description[dirty.kind] === 'string'"
          v-text="field.description[dirty.kind]"
        )
        .form-text.text-muted(
          v-else-if="field.description && typeof field.description === 'string'"
          v-text="field.description"
        )
      .alert.alert-danger(v-if="err")
        | {{ err ? err.message : 'err' }}
        pre: code: tt {{ (err && err.response && err.response.data) || err }}
      button.btn.btn-secondary(
        v-disabled='isSaveDisabled'
        @click.prevent.stop='saveTumblrPost'
      )
        i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='saving')
        i.fa.fa-fw.fa-btn.fa-floppy(v-else)
        span(v-if='saving') Saving
        span(v-else) Save
      button.btn.btn-info.btn-cancel(
        @click.prevent.stop='$emit("close")'
      )
        i.fa.fa-fw.fa-btn.fa-cancel
        | Cancel
      .crossposts(v-if='tumblrPosts.length')
        | Cross Posts:
        table
          tbody
            tr(v-for='entry in tumblrPosts')
              td
                nuxt-link(
                  :to='`/tumblr/${entry.data.blogName}`'
                  v-text='entry.data.blogName'
                )
              td
                AddToQueueButton(:item='entry')
              td
                nuxt-link(
                  :to='entry.data.route'
                  v-text='entry.data.id'
                )
              td
                a(
                  target='_blank'
                  :href='entry.data.permalink'
                )
                  i.fa.fa-fw.fa-btn.fa-tumblr
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import AddToQueueButton from '~/components/AddToQueueButton';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';

import QueryParamSelftext from '~/mixins/QueryParamSelftext';
import UserLink from '~/components/UserLink';
import { mapActions, mapGetters } from 'vuex';
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'TumblrShareForm',
  components: {
    AddToQueueButton,
    bFormInput,
    UserLink,
  },
  mixins: [QueryParamSelftext],
  props: {
    // reddit post
    parent: {
      type: Object,
      default: null,
    },
  },
  fields: Object.freeze({
    kind: {
      type: 'select',
      options: Object.freeze([
        { value: 'text', text: 'text' },
        { value: 'link', text: 'link' },
        { value: 'video', text: 'video' },
        { value: 'photo', text: 'photo' },
      ]),
      default({ parent, dirty }) {
        if (get(dirty, 'kind')) {
          return get(dirty, 'kind');
        }
        const post_hint = get(parent, 'data.post_hint');
        if (post_hint === 'image') {
          return 'photo';
        }
        if (post_hint === 'video') {
          return 'link';
        }
        if (get(parent, 'data.permalink')) {
          return 'link';
        }
        return 'text';
      },
    },
    state: {
      type: 'select',
      options: Object.freeze([
        { value: 'queue', text: 'queue' },
        { value: 'published', text: 'published' },
        { value: 'draft', text: 'draft' },
        { value: 'private', text: 'private' },
      ]),
      default({ dirty }) {
        if (get(dirty, 'state')) {
          return get(dirty, 'state');
        }
        return 'queue';
      },
    },
    tags: {
      type: 'text',
      default({ tumblrDefaultTags, selected_blog }) {
        if (selected_blog) {
          return get(tumblrDefaultTags, selected_blog) || '';
        }
        return '';
      },
    },
    // publish_on: { // ISO 8601 format
    //   type: 'text',
    //   default({ parent, tumblrDefaultTags }) { return tumblrDefaultTags || ''; },
    // },
    caption: {
      kinds: ['photo', 'video'],
      type: 'text',
      default({ parent }) {
        // maybe I want to caption from a comment
        if (get(parent, 'data.body_html')) {
          return get(parent, 'data.body_html');
        }
        return get(parent, 'data.title') || get(parent, 'data.link_title');
      },
      description: 'The user-supplied caption',
    },
    link: {
      kinds: ['photo'],
      type: 'text',
      default({ parent }) {
        return '';
        // return get(parent, 'data.url')
        //   || get(parent, 'data.link_url');
      },
      description: 'The "click-through URL" for the photo',
    },
    source: {
      kinds: ['photo', 'source'],
      type: 'text',
      default({ parent }) {
        return (
          get(parent, 'data.url') ||
          get(parent, 'data.link_url') ||
          get(parent, 'data.permalink')
        );
      },
      description: {
        photo: 'The photo source URL',
        quote: 'Quote: Cited source, HTML allowed',
      },
    },
    quote: {
      kinds: ['quote'],
      type: 'text',
      default({ parent }) {
        return '';
      },
      description: 'The full text of the quote, HTML entities must be escaped',
    },
    title: {
      kinds: ['link', 'text'],
      type: 'text',
      default({ parent }) {
        return get(parent, 'data.title') || get(parent, 'data.link_title');
      },
      description: {
        link:
          'The title of the page the link points to, HTML entities should be escaped',
      },
    },
    body: {
      kinds: ['text'],
      type: 'textarea',
      default({ parent }) {
        if (get(parent, 'data.body_html')) {
          return get(parent, 'data.body_html');
        }
        if (get(parent, 'data.selftext_html')) {
          return get(parent, 'data.selftext_html');
        }
        return get(parent, 'data.title') || get(parent, 'data.link_title');
      },
      description:
        'The title of the page the link points to, HTML entities should be escaped',
    },
    url: {
      kinds: ['link'],
      type: 'text',
      default({ parent }) {
        return (
          get(parent, 'data.url') ||
          get(parent, 'data.permalink') ||
          get(parent, 'data.link_url')
        );
      },
      description: 'The link',
    },
    thumbnail: {
      kinds: ['link'],
      type: 'text',
      default({ parent }) {
        return '';
      },
      description: 'The url of an image to use as a thumbnail for the post',
    },
    description: {
      kinds: ['link'],
      type: 'text',
      default({ parent }) {
        return '';
      },
      description: 'A user-supplied description, HTML allowed',
    },
    excerpt: {
      kinds: ['link'],
      type: 'text',
      default({ parent }) {
        return '';
      },
      description:
        'An excerpt from the page the link points to, HTML entities should be escaped',
    },
    author: {
      kinds: ['link'],
      type: 'text',
      default({ parent }) {
        return '';
      },
      description:
        'The name of the author from the page the link points to, HTML entities should be escaped',
    },
    embed: {
      kinds: ['video'],
      type: 'text',
      default({ parent }) {
        return (
          get(parent, 'data.url') ||
          // get(parent, 'data.permalink') ||
          get(parent, 'data.link_url')
        );
      },
      description:
        "HTML embed code for the video or a URI to the video. If you provide an unsupported service's URI you may receive a 400 response.",
    },
    // data: {
    //   kinds: ['video'],
    //   type: 'file',
    //   default({ parent }) { return null; },
    //   description: 'A video file, limit 100MB',
    // },
  }),
  data() {
    return {
      dirty: {},
      saving: false,
      err: null,
      tumblrPosts: [],
      selected_blog: null,
    };
  },
  computed: {
    ...mapGetters('tumblr', ['blogs']),
    ...mapGetters('settings', ['tumblrDefaultTags']),
    isSaveDisabled() {
      return false;
    },
    selectedBlog: {
      get() {
        return find(this.blogs, blog => blog.name === this.selected_blog);
      },
      set(value) {
        this.selected_blog = get(value, 'name', null);
      },
    },
    blogNames() {
      return map(this.blogs, blog => blog.name);
    },
    createBlogPost() {
      if (this.dirty.kind === 'text') {
        return this.createTextPost;
      } else if (this.dirty.kind === 'photo') {
        return this.createPhotoPost;
      } else if (this.dirty.kind === 'video') {
        return this.createVideoPost;
      } else if (this.dirty.kind === 'link') {
        return this.createLinkPost;
      }
      return null;
    },
  },
  watch: {
    'dirty.kind'() {
      this.dirty = this.freshDirty();
    },
    selected_blog() {
      this.dirty = this.freshDirty();
    },
  },
  mounted() {
    // this.selected_blog = this.defaultBlog();
    this.dirty = this.freshDirty();
  },
  methods: {
    ...mapActions('tumblr', [
      'createLinkPost',
      'createPhotoPost',
      'createVideoPost',
      'createTextPost',
    ]),
    freshDirty() {
      const { fields } = this.$options;
      const { dirty } = this;
      const kind = get(dirty, 'kind') || fields.kind.default(this);
      const data = Object.keys(fields).reduce(
        (carry, key) => {
          const field = fields[key];
          if (
            !carry.hasOwnProperty(key) &&
            (!field.kinds || field.kinds.includes(kind))
          ) {
            carry[key] = field.default(this);
          }
          return carry;
        },
        { kind },
      );
      return data;
    },
    defaultBlog() {
      const { parent, blogs } = this;
      let blog;
      const subreddit = get(parent, 'data.subreddit');
      blog = subreddit
        ? find(
            blogs,
            blog => blog.name.toLowerCase() === subreddit.toLowerCase(),
          )
        : null;
      if (blog) {
        return blog.name;
      }
      return get(blogs[0], 'name');
    },
    async saveTumblrPost() {
      const blogName = this.selected_blog;
      try {
        this.err = null;
        this.saving = true;
        const response = await this.createBlogPost({
          blogName,
          options: this.dirty,
        });
        this.tumblrPosts.push({
          kind: 'TumblrPost',
          data: {
            ...response.data,
            blogName,
            permalink: `https://${blogName}.tumblr.com/post/${response.data.id}`,
            route: `/tumblr/${blogName}/post/${response.data.id}`,
          },
        });
      } catch (err) {
        console.error(err);
        this.err = err;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="sass"></style>
