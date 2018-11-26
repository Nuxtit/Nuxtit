<template lang="pug">
  span.btn-mark-unread(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="hide"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-plus-circle(v-else-if='isUnread')
    i.fa.fa-fw.fa-btn.fa-minus-circle(v-else)
    span(v-if='busy && isUnread') unmarking read
    span(v-else-if='busy && !isUnread') marking unread
    span(v-else-if='isUnread') mark read
    span(v-else) mark unread
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'MarkUnreadButton',
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
    isUnread: {
      get() {
        return this.item.data.new;
      },
      set(value) {
        this.item.data.new = !!value;
      },
    },
    classes() {
      return {
        'text-muted': this.isUnread === false,
        'text-info': this.isUnread === true,
      };
    },
  },
  methods: {
    async hide($event) {
      const { name } = this.item.data;
      const { isUnread } = this;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${isUnread ? 'read_message' : 'unread_message'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.isUnread = !isUnread;
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
.btn-hide
  cursor: pointer
</style>
