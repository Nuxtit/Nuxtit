<template lang="pug">
  div
    h2 WikiBanned Users
    AddWikiBannedForm
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    WikiBannedUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import AddWikiBannedForm from '~/components/AddWikiBannedForm.vue';
import WikiBannedUserList from '~/components/WikiBannedUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    AddWikiBannedForm,
    WikiBannedUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/wikibanned`;
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
