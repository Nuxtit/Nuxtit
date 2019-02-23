<template lang="pug">
  div
    h2 Mod Log
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    ModLogList(:items='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import ModLogList from '~/components/ModLogList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    ModLogList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/log`;
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
