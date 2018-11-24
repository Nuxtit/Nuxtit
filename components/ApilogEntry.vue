<template lang="pug">
.apilog-entry
  .card
    .card-header
      tt(
        :class='item.status >= 400 ? "text-danger" : (item.status >= 300 ? "text-warning" : "text-success")'
        v-text='item.status'
      )
      | &#32;
      tt {{ (item.method || '').toUpperCase() }}
      | &#32;
      tt {{ item.fullPath }}
      span.text-muted &#32;as&#32;
      UserLink(:username='item.username')
      .pull-right
        | {{ item.ms.toFixed() }}&nbsp;ms&nbsp;
        TimeAgo.text-muted(:value='item.start')
        | &#32;
        span.btn-see-result(
          v-if='item.method !== "get"'
          @click.prevent.stop='showPayload^=true'
        )
          i.fa.fa-fw.fa-code
          span see payload
        | &#32;
        span.btn-see-result(
          @click.prevent.stop='showResult^=true'
        )
          i.fa.fa-fw.fa-code
          span see result
        | &#32;
        span.btn-see-source(
          @click.prevent.stop='showSource^=true'
        )
          i.fa.fa-fw.fa-code
          span see source
    .card-body(v-if='showPayload && item.method !== "get"')
      pre: tt {{ item.data }}
    .card-body(
      v-if='showResult'
      :class='item.status >= 400 ? "bg-danger" : (item.status >= 300 ? "bg-warning" : "bg-success")'
    )
      .card-text
        pre: tt {{ item.result }}
    pre(v-if="showSource")
      tt: small(v-text="item")
</template>

<script>
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'ApilogEntry',
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
    showPayload: makeComputeToggler('payload'),
    showResult: makeComputeToggler('result'),
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
