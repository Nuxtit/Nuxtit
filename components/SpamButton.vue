<template lang="pug">
  span.btn-remove(
    v-disabled="busy || item.spam"
    :class='classes'
    @click.stop.prevent="remove"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-cancel(v-else)
    span(v-if='busy && item.spam') unmarking spam
    span(v-else-if='busy && !item.spam') marking spam
    span(v-else-if='item.spam') marked spam
    span(v-else) spam
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// spam is the moderator action of marking an item as spam and removing from public visibility

export default {
  name: 'SpamButton',
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
        'text-danger': this.item.spam === true,
      };
    },
  },
  methods: {
    async remove($event) {
      const { spam, name } = this.item;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(`/api/remove`, {
          spam: true,
          // category: '???',
          id: name, // fullname
        });
        this.item.spam = true;
        if (this.item.approved) {
          this.item.approved = false;
        }
        if (this.item.removed) {
          this.item.removed = false;
        }
        if (this.item.approved_by) {
          this.item.approved_by = null;
        }
        if (this.item.approved_at_utc) {
          this.item.approved_at_utc = null;
        }
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
.btn-spam
  cursor: pointer
</style>
