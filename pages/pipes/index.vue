<template lang="pug">
  .container
    .row(v-if="noEndpoints"): .col: p No Endpoints Configured
    .row(v-else): .col: table.table.table-sm: tbody
      tr
        th Endpoint
      tr(
        v-for="(endpoint, name) in endpoints"
        :key="name"
      )
        td
          nuxt-link(
            :to="`/pipes/${name}`"
          )
            | {{ name }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import busyUntil from '~/mixins/busyUntil';

export default {
  middleware: ['auth'],
  // components: {
  // },
  // mixins: [busyUntil],
  computed: {
    ...mapGetters('pipes', ['endpoints', 'noEndpoints']),
  },
};
</script>
