<template lang="pug">
  span.btn-add-to-queue(
    v-show='isValidQueueable'
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="addToQueue"
    :title='tooltip'
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-times(v-else-if='queued')
    i.fa.fa-fw.fa-btn.fa-plus(v-else)
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
          this.remove(this.payload);
        }
      },
    },
    position() {
      const index = this.findIndex(this.payload);
      if (index >= 0) {
        return index + 1;
      }
    },
    classes() {
      return {
        'text-success': this.queued === true,
      };
    },
    isValidQueueable() {
      const { kind, data } = this.item;
      const { payload } = this;

      if (!(payload && payload.route)) {
        return false;
      }
      return true;
    },
    payload() {
      const { kind, data } = this.item;
      // console.log('payload', { kind, data });
      const route = data.permalink || data.context;
      const createdAt = now();
      if (kind === Kind.Comment) {
        return {
          name: data.name,
          text: (data.body || '').slice(0, 128),
          route,
          createdAt,
        };
        // console.log(data);
      } else if (kind === Kind.Post) {
        return {
          name: data.name,
          text: data.title,
          route,
          createdAt,
        };
        // console.log(data);
      } else if (kind === Kind.Message) {
        console.log(data);
        return {
          name: data.name,
          title: data.subject,
          route,
          createdAt,
        };
        // console.log(data);
      } else {
        // console.log('kind', kind);
      }
    },
    tooltip() {
      return JSON.stringify(this.payload, null, 2);
    },
  },
  methods: {
    ...mapActions('queue', ['add', 'remove']),
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
