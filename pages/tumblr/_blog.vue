<template lang="pug">
  .container
    b-nav(tabs)
      b-nav-item(
        to='/tumblr'
      ) all blogs
      b-nav-item(
        exact
        :to='`/tumblr/${blog.name}`'
      ) {{ blog.name }}
      b-nav-item(
        exact
        :to='`/tumblr/${blog.name}/posts`'
      ) Posts ({{ blog.posts }})
      b-nav-item(
        exact
        :to='`/tumblr/${blog.name}/queue`'
      ) Queue ({{ blog.queue }})
    nuxt-child(:blog="blog")
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
