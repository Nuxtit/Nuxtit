<template lang="pug">
  .subreddits-search
    SubredditSearchInput
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
import SubredditSearchInput from '~/components/SubredditSearchInput';

export default {
  components: {
    RedditPagination,
    SubredditList,
    SubredditSearchInput,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return '/subreddits/search';
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

<style lang="sass"></style>
