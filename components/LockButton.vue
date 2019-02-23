<template lang="pug">
  span.btn-lock(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="lock"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-lock(v-else)
    span(v-if='busy && item.data.locked') unlocking
    span(v-else-if='busy && !item.data.locked') locking
    span(v-else-if='item.data.locked') locked
    span(v-else) lock
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// lock is the moderator action of locking an item from public visibility

export default {
  name: 'LockButton',
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
        'text-success': this.item.data.locked === true,
      };
    },
  },
  methods: {
    async lock($event) {
      const { locked, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${locked ? 'unlock' : 'lock'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.item.data.locked = !locked;
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
.btn-lock
  cursor: pointer
</style>
