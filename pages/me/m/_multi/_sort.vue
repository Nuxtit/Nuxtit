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
import includes from 'lodash/includes';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  middleware: ['auth'],
  defaultSort: 'top',
  components: {
    PostList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/me/m/${route.params.multi}/${route.params.sort || 'top'}`;
      },
      query({ route }) {
        return {
          ...route.query,
        };
      },
    }),
    ValidatePostSort,
  ],
};
</script>
