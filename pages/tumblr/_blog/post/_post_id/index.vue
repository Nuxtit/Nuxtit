<template lang="pug">
  .container
    h2 post {{ $route.params.post_id }}
    Loading(v-if="fetching")
    TumblrPostRow(v-else-if="posts && posts[0]" :post="posts[0]")
    .alert.alert-danger(v-else) 404 Not Found
</template>

<script>
import TumblrPostRow from '~/components/Tumblr/TumblrPostRow';

export default {
  middleware: ['auth'],
  components: {
    TumblrPostRow,
  },
  props: {
    blog: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editingId: null,
      fetching: false,
      posts: [],
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        this.fetching = true;
        const response = await this.$store.dispatch('tumblr/fetchBlogPosts', {
          blogName: this.blog.name,
          options: {
            id: this.$route.params.post_id,
          },
        });
        this.posts = response.data.posts;
        // this.updateBlog(response.data.blog); // @todo
      } finally {
        this.fetching = false;
      }
    },
  },
};
</script>

<style lang="sass"></style>
