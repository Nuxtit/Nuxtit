<template lang="pug">
  div
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    ClientsideFilter(v-model='filterOptions')
    CommentList(:comments='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import ClientsideFilter from '~/components/ClientsideFilter.vue';
import CommentList from '~/components/CommentList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    ClientsideFilter,
    CommentList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/user/${route.params.username}/comments`;
      },
      query({ route }) {
        return {
          ...route.query,
          // sort: route.params.sort || 'new',
        };
      },
    }),
  ],
};
</script>
