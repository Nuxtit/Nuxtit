<template lang="pug">
  div
    .pull-right
      nuxt-link.btn.btn-secondary(
        v-for="option in $options.sorts"
        v-if="sortnt(option)"
        :to="$mergeRouteQuery(option.mrq)"
      )
        | {{ option.text }}
        i.fa.fa-sort-number-up(v-if="option.sortNumberUp")
        i.fa.fa-sort-number-down(v-if="option.sortNumberDown")
      | &#32;{{ collection.data.length }} of {{ collection.total }}
    .btn-group
    FeathersPagination(:collection="collection")
    table.table: tbody: tr(v-for="item in collection.data" :key="item.id"): td
      .row(v-if="linksMap[item.id]")
        .col
          PostEntry(:post="linksMap[item.id]")
      .row(v-if="linksMap[item.id]")
        .col(style="max-width: 50px")
        .col
          MixedItem(v-if="item.rItem" :item="item.rItem")
        PipeItemMenu.col.pipe-right-col(:item="item")
      .row(v-else :key="item.id")
        .col
          MixedItem(v-if="item.rItem" :item="item.rItem")
        PipeItemMenu.col.pipe-right-col(:item="item")
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
import PipeItemMenu from '~/components/Pipes/ItemMenu';
import MixedItem from '~/components/MixedItem';
import PostEntry from '~/components/PostEntry';
import { Kind } from '~/lib/enum';
import undata from '~/lib/undata';

const ASC = '1';
const DESC = '-1';

export default {
  middleware: ['auth'],
  watchQuery: true,
  components: {
    FeathersPagination,
    MixedItem,
    PostEntry,
    PipeItemMenu,
  },
  // mixins: [busyUntil],
  sorts: Object.freeze([
    { text: 'newest', mrq: { $sort: { saved_at: DESC } } },
    { text: 'oldest', mrq: { $sort: { saved_at: ASC } } },
    { text: 'score (asc)', mrq: { $sort: { score: ASC } }, sortNumberUp: 1 },
    { text: 'score (desc)', mrq: { $sort: { score: DESC } }, sortNumberDown: 1 },
    { text: 'link_id (asc)', mrq: { $sort: { link_id: ASC } }, sortNameUp: 1 },
    { text: 'link_id (desc)', mrq: { $sort: { link_id: DESC } }, sortNameDown: 1 },
  ]),
  props: {
    endpoint: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // client() {
    //   return this.$store.getters['pipes/client'](
    //     this.$route.params.endpoint_name,
    //   );
    // },
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

    // console.log({ collection });
    return {
      collection,
      linksMap: await linksForCollection(reddit, collection.data),
    };
  },
  methods: {
    sortnt(option) {
      const oldSort = this.$route.query.$sort;
      const newSort = option.mrq.$sort;
      console.log(JSON.stringify({ newSort, oldSort }));
      if (newSort && oldSort) {
        for (var k in newSort) {
          console.log(
            `newSort[${k}] !== oldSort[${k}]`,
            newSort[k] !== oldSort[k],
          );
          if (newSort[k] !== oldSort[k]) {
            return true;
          }
        }
        return false;
      }
      return true;
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
  const redditChildren = map(flatten(
    responses.map(response => get(response, 'data.data.children')),
  ), undata);
  input.forEach((item) => {
    item.rItem = find(redditChildren, redditItem => {
      return redditItem.name === item.id;
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
  const link_id_list = map(links, 'name');
  const commentlink_id_list = map(comments, 'link_id');
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
  const redditChildren = map(flatten(
    responses.map(response => get(response, 'data.data.children')),
  ), undata);
  // console.log({ redditChildren });
  redditChildren.forEach((item) => {
    links.push(item);
  });
  // console.log({links});
  const linksMap = input.reduce((carry, item) => {
    if (item && item.rItem && item.rItem.kind === Kind.Comment) {
      const link_id = item.rItem.link_id;
      // console.log(link_id);
      const link = link_id ? find(links, l => l.name === link_id) : null;
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
