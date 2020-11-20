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
        label.col-6
          | {{ field.name || key }}
          button.btn.btn-danger.btn-xs.pull-right.small(
            @click.prevent.stop='dirty[key] = field.clearButton.newValue'
          )
            i.fa.fa-fw.fa-cancel
            | clear
        b-select.col-6(
          v-if="field.type === 'select'"
          v-model="dirty[key]"
          :name="key"
          :options='field.options'
        )
        b-form-textarea.col-6(
          v-else-if="field.type === 'textarea'"
          v-model="dirty[key]"
          :name="key"
          :rows="3"
        )
        template(v-else-if="field.type === 'publish_on'")
          b-form-input.col-6(
            v-show='dirty.state === "queue"'
            v-model="dirty[key]"
            :name="key"
          )
          VueCtkDateTimePicker(
            v-if='dirty.state === "queue"'
            v-model="dirty[key]"
            :dark='true'
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
        pre: code.text-monospace {{ (err && err.response && err.response.data) || err }}
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
        | Tumblr X-Posts:
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
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import QueryParamSelftext from '~/mixins/QueryParamSelftext';
import UserLink from '~/components/UserLink';
import { mapActions, mapGetters } from 'vuex';
import { startMinWait } from '~/lib/sleep';
import fields from '~/lib/tumblr/fields';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

export default {
  name: 'TumblrShareForm',
  components: {
    AddToQueueButton,
    bFormInput,
    bFormTextarea,
    UserLink,
    VueCtkDateTimePicker,
  },
  mixins: [QueryParamSelftext],
  props: {
    // reddit post
    parent: {
      type: Object,
      default: null,
    },
  },
  fields,
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
            route: `/tumblr/${blogName}/posts?id=${response.data.id}`,
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
