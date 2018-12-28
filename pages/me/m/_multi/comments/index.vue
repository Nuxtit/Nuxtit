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
import includes from 'lodash/includes';
import ValidatePostSort from '~/mixins/ValidatePostSort';
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
        return `/me/m/${route.params.multi}/comments`;
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

<style>
</style>
