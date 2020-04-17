<template lang="pug">
  .container
    h2 queue
    Loading(v-if="fetching")
    template(v-else v-for="post in posts")
      TumblrPostForm(v-if="post.id === editingId" :post="post" :key="post.id")
      TumblrPostRow(v-else :post="post" :key="post.id")
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
        const response = await this.$store.dispatch('tumblr/fetchBlogQueue', {
          blogName: this.blog.name,
          options: {},
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
