<template lang="pug">
  span.btn-hide(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="hide"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-plus-circled(v-else-if='item.hidden')
    i.fa.fa-fw.fa-btn.fa-minus-circled(v-else)
    span(v-if='busy && item.hidden') unhiding
    span(v-else-if='busy && !item.hidden') hiding
    span(v-else-if='item.hidden') hidden
    span(v-else) hide
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'HideButton',
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
        'text-muted': this.item.hidden === true,
      };
    },
  },
  methods: {
    async hide($event) {
      const { hidden, name } = this.item;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${hidden ? 'unhide' : 'hide'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.item.hidden = !hidden;
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
