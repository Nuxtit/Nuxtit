<template lang="pug">
  div
    h2 Moderators
    AddModeratorForm
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    ModeratorUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import AddModeratorForm from '~/components/AddModeratorForm.vue';
import ModeratorUserList from '~/components/ModeratorUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    AddModeratorForm,
    ModeratorUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/moderators`;
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
