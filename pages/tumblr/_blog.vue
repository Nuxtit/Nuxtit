<template lang="pug">
  .container
    b-nav(tabs)
      b-nav-item(
        to='/tumblr'
      ) all blogs
      template(v-if='blog')
        b-nav-item(
          exact
          :to='`/tumblr/${blog.name}`'
        ) Profile ({{ blog.name }})
        b-nav-item(
          exact
          :to='`/tumblr/${blog.name}/dashboard`'
        ) Dashboard
        b-nav-item(
          exact
          :to='`/tumblr/${blog.name}/posts`'
        ) Posts ({{ blog.posts }})
        b-nav-item(
          exact
          :to='`/tumblr/${blog.name}/queue`'
        ) Queue ({{ blog.queue }})
        b-nav-item(
          exact
          :to='`/tumblr/${blog.name}/drafts`'
        ) Draft ({{ blog.drafts }})
    nuxt-child(v-if="blog" :blog="blog")
</template>

<script>
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  middleware: ['auth'],
  components: {
    bNav,
    bNavItem,
  },
  computed: {
    ...mapGetters('tumblr', ['blogs']),
    blog() {
      const name = this.$route.params.blog;
      return find(this.blogs, blog => blog.name === name);
    },
  },
};
</script>

<style lang="sass"></style>
