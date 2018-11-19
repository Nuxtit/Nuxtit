<template lang="pug">
  span.btn-remove(
    v-show='false /* @todo */'
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="remove"
  )
    i.fa.fa-fw.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-remove(v-else)
    span(v-if='busy && item.data.removed') unremoving
    span(v-else-if='busy && !item.data.removed') removing
    span(v-else-if='item.data.removed') removed
    span(v-else) remove
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// remove is the moderator action of removing an item from public visibility

export default {
  name: 'RemoveButton',
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
        'text-success': this.item.data.removed === true,
      };
    },
  },
  methods: {
    async remove($event) {
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
