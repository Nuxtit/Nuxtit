<template lang="pug">
  div
    table.table.table-sm
      tbody
        tr
          th Pipe
          th items
        tr(v-for="pipe in collection.data" :key="pipe.id")
          td {{ pipe.id }}
          td
            nuxt-link(
              :to="`/pipes/${$route.params.endpoint_name}/items/?pipe=${pipe.id}`"
              v-text="pipe.count"
            )
        tr
          td all
          td
            nuxt-link(
              :to="`/pipes/${$route.params.endpoint_name}/items/`"
              v-text="collection.data.reduce((c,p) => c+parseInt(p.count),0) || 0"
            )
</template>

<script>
export default {
  middleware: ['auth'],
  // components: {
  // },
  // mixins: [busyUntil],
  props: {
    endpoint: {
      type: Object,
      required: true,
    },
  },
  // computed: {
  //   client() {
  //     return this.$store.getters['pipes/client'](
  //       this.$route.params.endpoint_name,
  //     );
  //   },
  // },
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
};
</script>
