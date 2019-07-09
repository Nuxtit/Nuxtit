<template lang="pug">
  div
    h2 Approved Users
    AddContributorForm
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    ApprovedUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import AddContributorForm from '~/components/AddContributorForm.vue';
import ApprovedUserList from '~/components/ApprovedUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    AddContributorForm,
    ApprovedUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/contributors`;
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
