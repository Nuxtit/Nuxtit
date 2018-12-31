<template lang="pug">
  .subreddits
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    p(v-if='!(items.data && items.data.children)')
      | No subreddits found
    SubredditList(v-else :subreddits='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import RedditItems from '~/mixins/RedditItems';
import RedditPagination from '~/components/RedditPagination';
import SubredditList from '~/components/SubredditList';

export default {
  components: {
    RedditPagination,
    SubredditList,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return '/subreddits';
      },
      query({ route }) {
        return {
          ...route.query,
        };
      },
    }),
  ],
};
</script>

<style lang="sass">

</style>
