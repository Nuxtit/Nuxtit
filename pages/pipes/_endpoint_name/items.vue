<template lang="pug">
  div
    FeathersPagination(:collection="collection")
    table.table.table-sm
      tbody
        tr(v-for="item in collection.data" :key="item.id")
          td
            MixedItem(:item="item.rItem")
          td.small
            | {{ item.pipe }}
            br
            template(v-if="item.removed") removed
            button.btn.btn-sm(
              v-else
              @click.stop.prevent="remove(item)"
              v-disabled="deleting[item.id]"
            )
              i.fa.fa-fw.fa-btn.fa-spin.fa-spinner(v-if="deleting[item.id]")
              i.fa.fa-fw.fa-btn.fa-trash(v-else)
    FeathersPagination(:collection="collection" v-if="collection.data.length > 2")
</template>

<script>
import chunk from 'lodash/chunk';
import get from 'lodash/get';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import FeathersPagination from '~/components/FeathersPagination';
import MixedItem from '~/components/MixedItem';

export default {
  middleware: ['auth'],
  watchQuery: true,
  components: {
    FeathersPagination,
    MixedItem,
  },
  // mixins: [busyUntil],
  props: {
    endpoint: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleting: {},
    };
  },
  computed: {
    client() {
      return this.$store.getters['pipes/client'](
        this.$route.params.endpoint_name,
      );
    },
  },
  async asyncData({ route, store, reddit }) {
    const client = store.getters['pipes/client'](route.params.endpoint_name);
    const collection = await client.items.find({
      query: {
        $limit: 25,
        $sort: {
          saved_at: 1,
          score: 1,
        },
        ...route.query,
      },
    });

    await appendRedditItems(reddit, collection.data);
    return {
      collection,
    };
  },
  methods: {
    async remove(item) {
      try {
        this.$set(this.deleting, item.id, true);

        await this.client.items.remove(item.id);

        this.$set(item, 'removed', true);
      } finally {
        this.$set(this.deleting, item.id, false);
      }
    },
  },
};

async function appendRedditItems(reddit, input) {
  /* eslint-disable */

  // this api call only acepts 100;
  const chunks = chunk(uniq([
    // get fullnames whether these are posts or comments
    ...input.map(entry => entry.id),
    // get links, if these are comments
    // ...input.map(item => item.link_id).filter(Boolean),
  ]), 100);
  let responses = [];
  for (let i = 0; i < chunks.length; i++) {
    responses.push(await reddit.get('/api/info', {
      params: {
        id:  chunks[i].join(','),
        // url
      },
    }))
  }
  const redditChildren = flatten(
    responses.map(response => get(response, 'data.data.children')),
  );
  // console.log({ redditChildren });
  input.forEach((item) => {
    item.rItem = find(redditChildren, redditItem => {
      return redditItem.data.name === item.id;
    });
  });
}

</script>
