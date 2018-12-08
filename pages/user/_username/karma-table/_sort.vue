<template lang="pug">
  div
    .row.text-center
      .col(v-if='firstTimestamp')
        span.text-muted from:&#32;
        DateTime(
          :value='firstTimestamp'
        )
      .col
        h5
          | {{ items.data.children.length }} Items
          br
          small.text-muted on this page
      .col(v-if='lastTimestamp')
        span.text-muted until:&#32;
        DateTime(
          v-if='lastTimestamp'
          :value='lastTimestamp'
        )
    RedditPagination(
      :collection='items'
      :fetching='fetching'
    )
    KarmaTable(:items='items')
    RedditPagination(
      v-if='showBottomPagination'
      :collection='items'
      :fetching='fetching'
    )
</template>

<script>
import DateTime from '~/components/DateTime.vue';
import KarmaTable from '~/components/KarmaTable.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
import first from 'lodash/first';
import get from 'lodash/get';
import last from 'lodash/last';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    DateTime,
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
  computed: {
    firstTimestamp() {
      const { sort } = this.$route.params;
      if (sort && sort !== 'new') return;
      const item = first(this.items.data.children);
      return get(item.data, 'created_utc');
    },
    lastTimestamp() {
      const { sort } = this.$route.params;
      if (sort && sort !== 'new') return;
      const item = last(this.items.data.children);
      return get(item.data, 'created_utc');
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
