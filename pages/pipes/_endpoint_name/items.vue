<template lang="pug">
  div
    .pull-right {{ collection.data.length }} of {{ collection.total }}
    FeathersPagination(:collection="collection")
    table.table: tbody: tr(v-for="item in collection.data" :key="item.id"): td
      .row(v-if="linksMap[item.id]")
        .col
          PostEntry(:post="linksMap[item.id]")
      .row(v-if="linksMap[item.id]")
        .col(style="max-width: 50px")
        .col
          MixedItem(:item="item.rItem")
        .col.pipe-right-col
          | pipe: {{ item.pipe }}
          br
          br
          template(v-if="item.removed") removed
          button.btn.btn-sm(
            v-else
            @click.stop.prevent="remove(item)"
            v-disabled="deleting[item.id]"
          )
            i.fa.fa-fw.fa-btn.fa-spin.fa-spinner(v-if="deleting[item.id]")
            i.fa.fa-fw.fa-btn.fa-trash(v-else)
          br
          br
          AddToQueueButton(:item="item.rItem")
          nuxt-link(
            v-if="item.link_id || (item.name && item.name.startsWith('t3_'))"
            :to="$mergeRouteQuery({link_id: item.link_id || item.name})"
          ) thread
          br
          br
      .row(v-else :key="item.id")
        .col
          MixedItem(:item="item.rItem")
        .col.pipe-right-col
          | pipe: {{ item.pipe }}
          br
          br
          template(v-if="item.removed") removed
          button.btn.btn-sm(
            v-else
            @click.stop.prevent="remove(item)"
            v-disabled="deleting[item.id]"
          )
            i.fa.fa-fw.fa-btn.fa-spin.fa-spinner(v-if="deleting[item.id]")
            i.fa.fa-fw.fa-btn.fa-trash(v-else)
          br
          br
          AddToQueueButton(:item="item.rItem")
      br
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
import AddToQueueButton from '~/components/AddToQueueButton';
import MixedItem from '~/components/MixedItem';
import PostEntry from '~/components/PostEntry';
import { Kind } from '~/lib/enum';

export default {
  middleware: ['auth'],
  watchQuery: true,
  components: {
    AddToQueueButton,
    FeathersPagination,
    MixedItem,
    PostEntry,
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
        $sort: (() => {
          if (route.query.pipe === 'mod') {
            return {
              score: 1,
              saved_at: 1,
            };
          }
          return {
            saved_at: 1,
          };
        })(),
        ...route.query,
      },
    });

    await appendRedditItems(reddit, collection.data);
    return {
      collection,
      linksMap: await linksForCollection(reddit, collection.data),
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

async function linksForCollection(reddit, input) {
  /* eslint-disable */

  const links = map(input, 'rItem').filter(item => {
    return item && item.kind === Kind.Post
  });
  const comments = map(input, 'rItem').filter(item => {
    return item && item.kind === Kind.Comment
  });
  const link_id_list = map(links, 'data.name');
  const commentlink_id_list = map(comments, 'data.link_id');
  // console.log({link_id_list})
  // console.log({commentlink_id_list})
  // console.log({fetchableCommentLinkIdList: commentlink_id_list.filter(link_id => {
  //     return link_id && !link_id_list.includes(link_id);
  //   })})

  // this api call only acepts 100;
  const chunks = chunk(uniq([
    // get fullnames whether these are posts or comments
    ...commentlink_id_list.filter(link_id => {
      return link_id && !link_id_list.includes(link_id);
    }),
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
  redditChildren.forEach((item) => {
    links.push(item);
  });
  // console.log({links});
  const linksMap = input.reduce((carry, item) => {
    if (item && item.rItem && item.rItem.kind === Kind.Comment) {
      const link_id = item.rItem.data.link_id;
      console.log(link_id);
      const link = link_id ? find(links, l => l.data.name === link_id) : null;
      if (link) {
        carry[item.id] = link;
      }
    }
    return carry;
  }, {});
  // console.log({linksMap});
  return linksMap;
}
</script>

<style lang="sass">
.pipe-right-col
  max-width: 10px
  min-width: 100px
</style>
