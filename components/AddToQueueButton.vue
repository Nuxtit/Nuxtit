<template lang="pug">
  span.btn-add-to-queue(
    v-show='isValidQueueable'
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="addToQueue"
    :title='tooltip'
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-cancel(v-else-if='queued')
    i.fa.fa-fw.fa-btn.fa-plus(v-else)
    | &nbsp;
    span(v-if='busy && queued') unqueuing
    span(v-else-if='busy && !queued') queueing
    span(v-else-if='queued')
      | queued
      span(
        v-if='position'
        v-text='`(${position})`'
        :title='`position: ${position}`'
      )
    span(v-else) queue
</template>

<script>
import { startMinWait } from '~/lib/sleep';
import { mapGetters, mapActions } from 'vuex';
import { Kind } from '~/lib/enum';
import now from '~/lib/now';

export default {
  name: 'AddToQueueButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      busy: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters('queue', ['find', 'findIndex']),
    queued: {
      get() {
        return !!this.find(this.payload);
      },
      set(value) {
        if (value) {
          this.add(this.payload);
        } else {
          this.done(this.payload);
        }
      },
    },
    position() {
      const index = this.findIndex(this.payload);
      if (index >= 0) {
        return index + 1;
      }
      return null;
    },
    classes() {
      return {
        'text-success': this.queued === true,
      };
    },
    isValidQueueable() {
      const { payload } = this;

      if (!(payload && payload.route)) {
        return false;
      }
      return true;
    },
    payload() {
      const { item } = this;
      const { kind, permalink, context } = item;
      const route = permalink || context;
      const createdAt = now();
      if (kind === Kind.Comment) {
        return {
          name: item.name,
          text: (item.body || '').slice(0, 128),
          route,
          createdAt,
        };
        // console.log(item);
      } else if (kind === Kind.Post) {
        return {
          name: item.name,
          text: item.title,
          route,
          createdAt,
        };
        // console.log(item);
      } else if (kind === Kind.Message) {
        // console.log(item);
        return {
          name: item.name,
          title: item.subject,
          route,
          createdAt,
        };
        // console.log(item);
      } else {
        // console.log('kind', kind);
      }
      return null;
    },
    tooltip() {
      return JSON.stringify(this.payload, null, 2);
    },
  },
  methods: {
    ...mapActions('queue', ['add', 'done']),
    async addToQueue($event) {
      this.busy = true;
      const minWait = startMinWait();
      this.queued = !this.queued;
      await minWait;
      this.busy = false;
    },
  },
};
</script>

<style lang="sass">
.btn-add-to-queue
  cursor: pointer
</style>
