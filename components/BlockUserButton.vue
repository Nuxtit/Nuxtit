<template lang="pug">
  span.btn-block-user(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="hide"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-plus-circle(v-else-if='item.data.is_user_blocked')
    i.fa.fa-fw.fa-btn.fa-minus-circle(v-else)
    span(v-if='busy && item.data.is_user_blocked') unblocking
    span(v-else-if='busy && !item.data.is_user_blocked') blocking
    span(v-else-if='item.data.is_user_blocked') blocked
    span(v-else) block
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'BlockUserButton',
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
    username() {
      return this.message.data.author;
    },
    classes() {
      return {
        'text-muted': this.item.data.is_user_blocked === true,
      };
    },
  },
  methods: {
    async hide($event) {
      const { is_user_blocked, name } = this.item.data;
      const { username } = this;
      const minWait = startMinWait();
      try {
        this.busy = true;
        // @todo test unblock button
        const response = await this.$reddit.post(
          `/api/${is_user_blocked ? 'unblock_user' : 'block_user'}`,
          {
            api_type: 'json',
            // account_id: // fullname of user
            name: username, // fullname
          },
        );
        this.item.data.is_user_blocked = !is_user_blocked;
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
