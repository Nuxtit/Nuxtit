<template lang="pug">
  table.table.table-sm
    tbody
      tr
        th 
          i.fa.fa-fw.fa-link-ext
        th 
          | Blog
        th
          small Followers
        th
          small Queue
        th
          small Posts
        th
          small default tags
    tbody
      tr(
        v-for="(blog, index) in blogs"
        :key="blog.uuid"
      )
        td
          a(
            :href="blog.url"
          )
            i.fa.fa-fw.fa-link-ext
        td 
          nuxt-link(
            :to="`/tumblr/${blog.name}`"
          ) {{ blog.name }}
        td {{ blog.followers }}
        td {{ blog.queue }}
        td {{ blog.posts }}
        td
          b-form-input(:value="getDefaultTag(blog.name)", @change="setDefaultTag(blog.name, $event)")
</template>

<script>
import get from 'lodash/get';
import { BindSettings } from '~/lib/settings';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'MyBlogList',
  computed: {
    ...BindSettings(['tumblrSelectedBlog', 'tumblrDefaultTags']),
    ...mapGetters('tumblr', ['blogs']),
  },
  methods: {
    getDefaultTag(blogname) {
      return get(this.tumblrDefaultTags, blogname) || '';
    },
    setDefaultTag(blogname, value) {
      this.tumblrDefaultTags = {
        ...this.tumblrDefaultTags,
        [blogname]: value ? value : void 0,
      };
    },
  },
};
</script>
