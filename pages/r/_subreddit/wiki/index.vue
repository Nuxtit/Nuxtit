<template lang="pug">
  div
    h2 Wiki Index
    ul
      li(v-for="wikipage_path in wikipage_path_list")
        nuxt-link(:to="`/r/${$route.params.subreddit}/wiki/${wikipage_path}`" v-text="wikipage_path")
</template>

<script>
export default {
  middleware: ['auth'],
  async asyncData({ reddit, route }) {
    const { subreddit } = route.params;
    const wikipage_path_list = (await reddit.get(`/r/${subreddit}/wiki/pages`))
      .data.data;

    console.log(wikipage_path_list);

    return {
      wikipage_path_list,
    };
  },
};
</script>
