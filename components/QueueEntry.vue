<template lang="pug">
.apilog-entry
  .card
    .card-header
      nuxt-link(
        :to='item.route || "/nuxtit/queue?error=1"'
        v-text='item.text'
      )
      .pull-right
        //- TimeAgo.text-muted(:value='item.createdAt')
        | &#32;
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
  name: 'QueueEntry',
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
.apilog-entry
  .card
    .card-header, .card-footer, .card-body
      padding: 0.20rem;
</style>
