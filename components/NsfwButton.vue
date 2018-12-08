<template lang="pug">
  span.btn-remove(
    v-show='false /* @todo */'
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="nsfw"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-exclamation-triangle(v-else)
    span(v-if='busy && item.data.nsfw') unmarking nsfw
    span(v-else-if='busy && !item.data.nsfw') marking nsfw
    span(v-else-if='item.data.nsfw') nsfw
    span(v-else) nsfw
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
      // const { removed, name } = this.item.data;
      // const minWait = startMinWait();
      // try {
      //   this.busy = true;
      //   const response = await this.$reddit.post(
      //     `/api/${removed ? 'remove' : 'unremove'}`,
      //     {
      //       // category: '???',
      //       id: name, // fullname
      //     },
      //   );
      //   this.item.data.removed = !removed;
      // } catch (err) {
      //   console.error(err);
      //   this.error = err;
      // } finally {
      //   await minWait;
      //   this.busy = false;
      // }
    },
  },
};
</script>

<style lang="sass">
.btn-remove
  cursor: pointer
</style>
