<template lang="pug">
  .container
    .row
      .col
        .form-group
          label
            | consumer_key
          b-form-input(
            v-model="tumblrConsumerKey"
          )
      .col
        .form-group
          label
            | consumer_secret
          b-form-input(
            v-model="tumblrConsumerSecret"
          )
    .row
      .col
        .form-group
          label
            | token
          b-form-input(
            v-model="tumblrToken"
          )
      .col
        .form-group
          label
            | token_secret
          b-form-input(
            v-model="tumblrTokenSecret"
          )
    .row
      .col
        .form-group.tumblr-fetch-blogs
          button.btn.btn-primary(
            @click.stop.prevent='fetchUserInfo'
          )
            | Fetch User Info
        .alert.alert-warning
          | Your user info and blog list will only be updated when you click this button
      .col
        code: tt {{ { blogNames} }}
    .row(v-if="blogs.length > 0")
      .col
        MyBlogList
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import MyBlogList from '~/components/Tumblr/MyBlogList';
import { mapActions, mapGetters } from 'vuex';
import { BindSettings } from '~/lib/settings';

export default {
  middleware: ['auth'],
  components: {
    bNav,
    bNavItem,
    MyBlogList,
  },
  data() {
    return {
      selected_blog: null,
    };
  },
  computed: {
    ...mapGetters('tumblr', ['blogs']),
    ...BindSettings([
      'tumblrConsumerKey',
      'tumblrConsumerSecret',
      'tumblrToken',
      'tumblrTokenSecret',
      'tumblrSelectedBlog',
    ]),
    blogNames() {
      return map(this.blogs, blog => blog.name);
    },
    selectedBlog: {
      get() {
        return find(this.blogs, blog => blog.name === this.selected_blog);
      },
      set(value) {
        this.selected_blog = get(value, 'name', null);
      },
    },
  },
  methods: {
    ...mapActions('tumblr', ['fetchUserInfo']),
  },
};
</script>

<style lang="sass"></style>
