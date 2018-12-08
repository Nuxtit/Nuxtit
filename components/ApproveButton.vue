<template lang="pug">
  span.btn-approve(
    v-disabled="busy || item.data.approved"
    :class='classes'
    @click.stop.prevent="approve"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-check(v-else-if='item.data.approved')
    span(v-if='busy && item.data.approved') unapproving
    span(v-else-if='busy && !item.data.approved') approving
    span(v-else-if='item.data.approved') approved
    span(v-else) approve
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// approve is the moderator action of approving an item from public visibility

export default {
  name: 'ApproveButton',
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
        'text-success': this.item.data.approved === true,
      };
    },
  },
  methods: {
    async approve($event) {
      const { approved, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(`/api/approve`, {
          // category: '???',
          id: name, // fullname
        });
        this.item.data.approved = true;
        if (this.item.data.removed) {
          this.item.data.removed = false;
        }
        if (this.item.data.spam) {
          this.item.data.spam = false;
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
.btn-approve
  cursor: pointer
</style>
