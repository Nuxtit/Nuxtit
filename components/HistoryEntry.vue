<template lang="pug">
.history-entry
  .card
    .card-header.text-monospace {{ item.path }}<span class='text-muted'>?...</span>
    .card-body
      table: tbody: tr(
        v-for='se in item.subEntries'
        :key='se.timestamp'
      )
        td
          nuxt-link.text-monospace(
            :to='se.fullPath'
          )
            | {{ se.fullPath }}
        td
          TimeAgo(:value='se.timestamp')
    .card-footer.bg-light
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        | &#32;see source
    pre.small.text-monospace(v-if="showSource" v-text="item")
</template>

<script>
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'HistoryEntry',
  components: {
    TimeAgo,
    UserLink,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: null,
    };
  },
  computed: {
    showSource: makeComputeToggler('source'),
  },
};
</script>

<style lang="sass">
.history-entry
  .card
    .card-header, .card-footer, .card-body
      padding: 0.20rem;
</style>
