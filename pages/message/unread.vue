<template lang="pug">
  .message-list
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    MessageList(:messages='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import MessageList from '~/components/MessageList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    MessageList,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return '/message/unread';
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
