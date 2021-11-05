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
import map from 'lodash/map';
import undata from '~/lib/undata';

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
      return { children: map(this.items, undata) };
    },
  },
};
</script>

<style lang="sass"></style>
