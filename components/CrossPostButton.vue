<template lang="pug">
  span.btn-hide(
    v-show='false /* @todo */'
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="hide"
  )
    i.fa.fa-fw.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-hide(v-else)
    span(v-if='busy && item.data.hidden') unhiding
    span(v-else-if='busy && !item.data.hidden') hiding
    span(v-else-if='item.data.hidden') hidden
    span(v-else) hide
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'CrossPostButton',
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
        'text-success': this.item.data.hidden === true,
      };
    },
  },
  methods: {
    async hide($event) {
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
.btn-hide
  cursor: pointer
</style>
