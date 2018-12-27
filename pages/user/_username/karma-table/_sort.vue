<template lang="pug">
  div
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    KarmaTable(:items='items' :user='user')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import KarmaTable from '~/components/KarmaTable.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    KarmaTable,
    RedditPagination,
  },
  mixins: [
    RedditItems({
      path({ route }) {
        return `/user/${route.params.username}/overview`;
      },
      query({ route }) {
        return {
          limit: 100,
          ...route.query,
          sort: route.params.sort || 'new',
        };
      },
    }),
  ],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  beforeMount() {
    if (!this.$route.query.limit) {
      this.$router.replace({
        ...this.$route,
        query: {
          ...this.$route.query,
          limit: 100,
        },
      });
    }
  },
};
</script>
