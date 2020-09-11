<template lang="pug">
  .container
    h2
      nuxt-link(:to="`/pipes/${$route.params.endpoint_name}`")
        | {{ $route.params.endpoint_name }}
    nuxt-child(v-if="endpoint" :endpoint="endpoint")
    .alert.alert-danger(v-else) Endpoint Not Found
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
    ...mapGetters('pipes', ['endpoints']),
    endpoint() {
      return this.endpoints[this.$route.params.endpoint_name];
    },
  },
};
</script>
