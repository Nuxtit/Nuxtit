<template lang="pug">
  div
    table.table.table-sm
      tbody
        tr
          th Pipe
          th Subreddits
        tr(v-for="pipe in collection.data" :key="pipe.id")
          td
            nuxt-link(
              :to="`/pipes/${$route.params.endpoint_name}/items/?pipe=${pipe.id}`"
            ) {{ pipe.id }} ({{ pipe.count }})
          td
            div(@click="toggleShowSub(pipe)") subs: {{ pipe.subs.length }}
            table.table.table-sm(v-if="showSub === pipe.id")
              tbody
                tr(v-for="sub in pipe.subs" :key="sub.subreddit")
                  td
                    nuxt-link(
                      :to="`/pipes/${$route.params.endpoint_name}/items/?pipe=${pipe.id}&subreddit=${sub.subreddit}`"
                    ) {{ sub.subreddit }} ({{ sub.count }})
                    | &nbsp;
                    nuxt-link(
                      v-if="allCountsBySub[sub.subreddit] > sub.count"
                      :to="`/pipes/${$route.params.endpoint_name}/items/?subreddit=${sub.subreddit}`"
                    ) (all pipes: {{allCountsBySub[sub.subreddit]}})
        tr
          td
            nuxt-link(
              :to="`/pipes/${$route.params.endpoint_name}/items/`"
            ) all ({{ allCount }})
          td subs: {{ allSubsCount }}
</template>

<script>
export default {
  // components: {
  // },
  // mixins: [busyUntil],
  props: {
    endpoint: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showSub: 'mod',
    };
  },
  middleware: ['auth'],
  computed: {
    allCount() {
      // eslint-disable-next-line
      return this.collection.data.reduce((c,p) => c+parseInt(p.count),0) || 0;
    },
    allCountsBySub() {
      // eslint-disable-next-line
      const subs = {};
      this.collection.data.forEach(p => {
        p.subs.forEach(s => {
          if (subs[s.subreddit] > 0) {
            subs[s.subreddit] += s.count;
          } else {
            subs[s.subreddit] = s.count;
          }
        });
      });
      return subs;
    },
    allSubsCount() {
      // eslint-disable-next-line
      return Object.keys(this.allCountsBySub).length;
    },
  },
  async asyncData({ route, store }) {
    const client = store.getters['pipes/client'](route.params.endpoint_name);
    return {
      collection: await client.stats.find({
        query: {
          $limit: 50,
          ...route.query,
        },
      }),
    };
  },
  methods: {
    toggleShowSub(pipe) {
      if (this.showSub === pipe.id) {
        this.showSub = null;
      } else {
        this.showSub = pipe.id;
      }
    },
  },
};
</script>
