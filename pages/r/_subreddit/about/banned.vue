<template lang="pug">
  div
    h2 Banned Users
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    BannedUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import BannedUserList from '~/components/BannedUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    BannedUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/banned`;
      },
      query({ route }) {
        return {
          ...route.query,
        };
      },
    }),
  ],
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
