<template lang="pug">
  div
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    MixedList(:items='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import MixedList from '~/components/MixedList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  defaultSort: 'new',
  components: {
    MixedList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/user/${route.params.username}/hidden`;
      },
      query({ route }) {
        return {
          ...route.query,
          sort: route.params.sort || 'new',
        };
      },
    }),
  ],
};
</script>
