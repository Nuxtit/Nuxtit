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
  name: 'UpVote',
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
        'fa fa-fw fa-btn': true,
        'text-success': this.item.likes === true,
        'fa-up-big': !this.voting,
        'fa-spinner fa-spin': this.voting,
      };
    },
  },
  methods: {
    async vote($event) {
      const { likes, name } = this.item;
      const minWait = startMinWait();
      try {
        this.voting = true;
        const response = await this.$reddit.post('/api/vote', {
          dir: likes === true ? 0 : 1,
          id: name, // fullname
          rank: 7,
          // uh / X-Modhash header // not required with OAuth
        });
        this.item.likes = likes === true ? null : true;
        if (likes === true) {
          this.item.score--;
        } else if (likes === false) {
          this.item.score += 2;
        } else {
          this.item.score++;
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
