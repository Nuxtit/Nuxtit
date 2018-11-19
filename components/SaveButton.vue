<template lang="pug">
  span.btn-save(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="save"
  )
    i.fa.fa-fw.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-bookmark(v-else)
    span(v-if='busy && item.data.saved') unsaving
    span(v-else-if='busy && !item.data.saved') saving
    span(v-else-if='item.data.saved') saved
    span(v-else) save
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'SaveButton',
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
        'text-success': this.item.data.saved === true,
      };
    },
  },
  methods: {
    async save($event) {
      const { saved, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${saved ? 'save' : 'unsave'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.item.data.saved = !saved;
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
.btn-save
  cursor: pointer
</style>
