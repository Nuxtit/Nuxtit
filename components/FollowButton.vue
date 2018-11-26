<template lang="pug">
  span.btn-follow(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="follow"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-bookmark(v-else)
    span(v-if='busy && item.data.subreddit.user_is_subscriber') unfollowing...
    span(v-else-if='busy && !item.data.subreddit.user_is_subscriber') following...
    span(v-else-if='item.data.subreddit.user_is_subscriber') following
    span(v-else) follow
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'FollowButton',
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
        'text-info': this.item.data.subreddit.user_is_subscriber === true,
        'text-success': this.item.data.subreddit.user_is_subscriber === false,
      };
    },
  },
  methods: {
    async follow($event) {
      const { name } = this.item.data;
      const { user_is_subscriber } = this.item.data.subreddit;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post('/api/subscribe', {
          action: user_is_subscriber ? 'unsub' : 'sub',
          sr_name: name, // fullname
          api_type: 'json',
        });
        this.item.data.subreddit.user_is_subscriber = !user_is_subscriber;
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
.btn-follow
  cursor: pointer
</style>
