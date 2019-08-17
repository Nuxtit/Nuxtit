<template lang="pug">
  span.btn-remove(
    v-disabled="busy || item.data.spam"
    :class='classes'
    @click.stop.prevent="remove"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-times(v-else)
    span(v-if='busy && item.data.spam') unmarking spam
    span(v-else-if='busy && !item.data.spam') marking spam
    span(v-else-if='item.data.spam') marked spam
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
        'text-danger': this.item.data.spam === true,
      };
    },
  },
  methods: {
    async remove($event) {
      const { spam, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(`/api/remove`, {
          spam: true,
          // category: '???',
          id: name, // fullname
        });
        this.item.data.spam = true;
        if (this.item.data.approved) {
          this.item.data.approved = false;
        }
        if (this.item.data.removed) {
          this.item.data.removed = false;
        }
        if (this.item.data.approved_by) {
          this.item.data.approved_by = null;
        }
        if (this.item.data.approved_at_utc) {
          this.item.data.approved_at_utc = null;
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
