<template lang="pug">
  div
    h2 Muted Users
    AddMutedForm
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    MutedUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import AddMutedForm from '~/components/AddMutedForm.vue';
import MutedUserList from '~/components/MutedUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    AddMutedForm,
    MutedUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/muted`;
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
