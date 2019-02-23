<template lang="pug">
  span.btn-nsfw(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="nsfw"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-exclamation-triangle(v-else)
    span(v-if='busy && item.data.over_18') unmarking nsfw
    span(v-else-if='busy && !item.data.over_18') marking nsfw
    span(v-else-if='item.data.over_18') unmark nsfw
    span(v-else) mark nsfw
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'NsfwButton',
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
        'text-success': this.item.data.nsfw === true,
      };
    },
  },
  methods: {
    async nsfw($event) {
      const { over_18, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${over_18 ? 'unmarknsfw' : 'marknsfw'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.item.data.over_18 = !over_18;
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
.btn-nsfw
  cursor: pointer
</style>
