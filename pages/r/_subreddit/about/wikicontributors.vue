<template lang="pug">
  div
    h2 WikiContributor Users
    AddWikiContributorForm
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    WikiContributorUserList(:users='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>
<script>
import AddWikiContributorForm from '~/components/AddWikiContributorForm.vue';
import WikiContributorUserList from '~/components/WikiContributorUserList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    AddWikiContributorForm,
    WikiContributorUserList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/r/${route.params.subreddit}/about/wikicontributors`;
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
