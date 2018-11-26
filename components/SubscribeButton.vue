<template lang="pug">
  span.btn-subscribe(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="subscribe"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-bookmark(v-else)
    span(v-if='busy && item.data.user_is_subscriber') unsubscribing
    span(v-else-if='busy && !item.data.user_is_subscriber') subscribing
    span(v-else-if='item.data.user_is_subscriber') subscribed
    span(v-else) subscribe
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'SubscribeButton',
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
    classes() {
      return {
        'text-success': this.item.data.user_is_subscriber === true,
      };
    },
  },
  methods: {
    async subscribe($event) {
      const { user_is_subscriber, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post('/api/subscribe', {
          action: user_is_subscriber ? 'unsub' : 'sub',
          sr: name, // fullname
        });
        this.item.data.user_is_subscriber = !user_is_subscriber;
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        await minWait;
        this.busy = false;
      }
    },
  },
};
</script>

<style lang="sass">
.btn-subscribe
  cursor: pointer
</style>
