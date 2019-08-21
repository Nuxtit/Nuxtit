<template lang="pug">
  .subreddits
    RedditPagination(
      :collection='collection'
      :fetching='fetching'
    )
    MultiList(:multis='collection')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='collection'
      :fetching='fetching'
    )
</template>

<script>
import RedditItems from '~/mixins/RedditItems';
import RedditPagination from '~/components/RedditPagination';
import MultiList from '~/components/MultiList';

export default {
  components: {
    RedditPagination,
    MultiList,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return '/api/multi/mine';
      },
      query({ route }) {
        return {
          ...route.query,
          expand_srs: false,
        };
      },
    }),
  ],
  computed: {
    collection() {
      return { data: { children: this.items } };
    },
  },
};
</script>

<style lang="sass"></style>
