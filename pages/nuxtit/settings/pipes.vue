<template lang="pug">
  .container
    .row(v-if="!(adding || editing)"): .col
      button.btn.btn-success(@click="adding = !adding; editing = null")
        i.fa.fa-fw.fa-btn.fa-plus
        | Add Endpoint
    .row(v-if="adding || editing"): .col
      PipeForm(
        :adding="adding"
        :editing="editing"
        @close="adding = false; editing = null"
      )
    .row(v-else-if="noEndpoints"): p No Endpoints
    .row(v-else): .col
      .col: table.table.table-sm: tbody
        tr
          th Endpoint
          th
        tr(
          v-for="(endpoint, name) in endpoints"
          :key="name"
        )
          td
            nuxt-link(
              :to="`/pipes/${name}`"
            )
              | {{ name }}
          td
            button.btn.btn-sm.btn-info(@click="adding = false; editing = name")
              i.fa.fa-fw.fa-btn.fa-edit
</template>

<script>
import PipeForm from '~/components/Pipes/PipeForm';
import { mapActions, mapGetters } from 'vuex';
// import busyUntil from '~/mixins/busyUntil';

export default {
  middleware: ['auth'],
  components: {
    PipeForm,
  },
  // mixins: [busyUntil],
  data() {
    return {
      adding: false,
      editing: null,
    };
  },
  computed: {
    ...mapGetters('pipes', ['endpoints', 'noEndpoints']),
  },
  methods: {
    ...mapActions('pipes', ['deleteEndpoint']),
  },
};
</script>
