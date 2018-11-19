<template lang="pug">
  i.btn-upvote(
    v-disabled="voting"
    :class='classes'
    @click.stop.prevent="vote"
  )
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'DownVote',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      voting: false,
      error: null,
    };
  },
  computed: {
    classes() {
      return {
        'fa fa-fw': true,
        'text-danger': this.item.data.likes === false,
        'fa-arrow-down': !this.voting,
        'fa-spinner fa-spinning': this.voting,
      };
    },
  },
  methods: {
    async vote($event) {
      const { likes, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.voting = true;
        const response = await this.$reddit.post('/api/vote', {
          dir: likes === false ? 0 : -1,
          id: name, // fullname
          rank: 2,
          // uh / X-Modhash header // not required with OAuth
        });
        this.item.data.likes = likes === false ? null : false;
        if (likes === false) {
          this.item.data.score++;
        } else if (likes === true) {
          this.item.data.score -= 2;
        } else {
          this.item.data.score--;
        }
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        await minWait;
        this.voting = false;
      }
    },
  },
};
</script>

<style lang="sass">
.btn-upvote
  cursor: pointer
</style>
