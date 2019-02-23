<template lang="pug">
  span.btn-spoiler(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="spoiler"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-user-secret(v-else)
    span(v-if='busy && item.data.spoiler') unmarking spoiler
    span(v-else-if='busy && !item.data.spoiler') marking spoiler
    span(v-else-if='item.data.spoiler') unspoiler
    span(v-else) spoiler
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'SpoilerButton',
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
        // 'text-success': this.item.data.spoiler === true,
      };
    },
  },
  methods: {
    async spoiler($event) {
      const { spoiler, name } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/api/${spoiler ? 'unspoiler' : 'spoiler'}`,
          {
            // category: '???',
            id: name, // fullname
          },
        );
        this.item.data.spoiler = !spoiler;
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
.btn-spoiler
  cursor: pointer
</style>
