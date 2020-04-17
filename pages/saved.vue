<template lang="pug">
  div
    h2 Saved
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
import ValidatePostSort from '~/mixins/ValidatePostSort';
import MixedList from '~/components/MixedList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    MixedList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route, store }) {
        return `/user/${store.getters['auth/MeData'].name}/saved`;
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
