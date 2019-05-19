<template lang="pug">
  div
    i.fa.fa-fw.fa-spinner.fa-spin(
      v-if='busy'
    )
    .alert.alert-info
      p May take a long time for users with long post histories.
      p Reddit will stop sending results between 1000 to 2000 entries.
    KarmaTable(
      v-if='items !== null'
      :rows='items'
      :user='user'
    )
</template>

<script>
import KarmaTable from '~/components/KarmaTable.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import { sortObject } from '~/lib/object';
import get from 'lodash/get';
import last from 'lodash/last';
import reduce from 'lodash/reduce';
import isInteger from 'lodash/isInteger';
import { Kind } from '~/lib/enum';

// const limit = 5;
const limit = 100;

export default {
  middleware: ['auth'],
  components: {
    KarmaTable,
    RedditPagination,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      busy: true,
      items: null,
    };
  },
  async mounted() {
    try {
      this.busy = true;

      if (this.$route.params.username) {
        const aggregates = await this.fetchData({
          limit,
        });
        this.items = sortObject(aggregates);
      }
    } finally {
      this.busy = false;
    }
  },
  methods: {
    async fetchData(params, aggregate = {}) {
      const path = `/user/${this.$route.params.username}/overview`;
      const res = await this.$reddit.get(path, {
        params,
      });

      const batchSize = get(res, 'data.data.children.length', 0);
      const after = get(res, 'data.data.after');
      // const lastId = get(last(res.data.data), 'id');
      // const lastCreatedUtc = get(last(res.data.data), 'created_utc');

      // console.log({ batchSize, lastId, lastCreatedUtc });
      // console.log({ batchSize, limit, after });
      // console.log(res.data.data[0]);

      reduce(res.data.data.children, reducer, aggregate);

      if (limit > batchSize || !after) {
        return aggregate;
      }
      // return aggregate;

      await wait(100);

      return this.fetchData(
        {
          ...params,
          after,
        },
        aggregate,
      );
    },
  },
};

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function blankSubAggregate() {
  return {
    pc: 0,
    pk: 0,
    cc: 0,
    ck: 0,
    // oc: 0,
  };
}

function reducer(carry, { kind, data }) {
  // console.log({ kind, data });
  if (!carry[data.subreddit]) {
    carry[data.subreddit] = {
      pc: 0,
      pk: 0,
      cc: 0,
      ck: 0,
      oc: 0,
    };
  }
  if (isInteger(data.score)) {
    if (kind === Kind.Post) {
      carry[data.subreddit].pk += data.score;
      carry[data.subreddit].pc++;
    } else if (kind === Kind.Comment) {
      carry[data.subreddit].ck += data.score;
      carry[data.subreddit].cc++;
    } else {
      // carry[data.subreddit].oc++;
    }
  }
  return carry;
}
</script>
