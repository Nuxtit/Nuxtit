<template lang="pug">
  span.btn-set-friend(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="setFriend"
  )
    i.fa.fa-fw.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-minus(v-if="item.data.is_friend")
    i.fa.fa-fw.fa-plus(v-else)
    span(v-if='busy && item.data.is_friend') unfriending
    span(v-else-if='busy && !item.data.is_friend') friending
    span(v-else-if='item.data.is_friend') friend
    span(v-else) friend
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'FriendButton',
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
        'text-danger': this.item.data.is_friend === true,
        'text-success': this.item.data.is_friend === false,
      };
    },
  },
  methods: {
    async setFriend($event) {
      const { is_friend, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        if (is_friend) {
          const response = await this.$reddit.delete(
            `/api/v1/me/friends/${name}`,
            {
              id: name, // fullname
            },
          );
        } else {
          const response = await this.$reddit.put(
            `/api/v1/me/friends/${name}`,
            // this one is JSON api for some reason
            JSON.stringify({
              name, // fullname
            }),
          );
        }
        this.item.data.is_friend = !is_friend;
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
.btn-set-friend
  cursor: pointer
</style>
