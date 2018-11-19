<template lang="pug">
  div
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    PostList(:posts='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    PostList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/${route.params.sort || 'new'}`;
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
