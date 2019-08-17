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
        'text-success': this.item.data.likes === true,
        'fa-up-big': !this.voting,
        'fa-spinner fa-spin': this.voting,
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
          dir: likes === true ? 0 : 1,
          id: name, // fullname
          rank: 7,
          // uh / X-Modhash header // not required with OAuth
        });
        this.item.data.likes = likes === true ? null : true;
        if (likes === true) {
          this.item.data.score--;
        } else if (likes === false) {
          this.item.data.score += 2;
        } else {
          this.item.data.score++;
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
