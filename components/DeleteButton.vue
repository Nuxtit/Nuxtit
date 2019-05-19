<template lang="pug">
  span.btn-delete(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="trash"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-trash(v-else)
    span(v-if='prompted') Are you sure? (delete)
    span(v-else-if='busy && item.data.deleted') deleting
    span(v-else-if='busy && !item.data.deleted') deleting
    span(v-else-if='item.data.deleted') deleted
    span(v-else) delete
</template>

<script>
import get from 'lodash/get';
import { startMinWait } from '~/lib/sleep';

// delete is the user action of permanently trashing their own item

export default {
  name: 'DeleteButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      prompted: false,
      busy: false,
      error: null,
    };
  },
  computed: {
    classes() {
      return {
        'text-danger': this.item.data.deleted,
      };
    },
  },
  methods: {
    async trash($event) {
      if (this.prompted) {
        const { deleted, name } = this.item.data;
        const minWait = startMinWait();
        try {
          this.busy = true;
          const response = await this.$reddit.post(
            '/api/del',
            {
              // category: '???',
              id: name, // fullname
            },
            {
              username: get(this.item, 'data.author'),
            },
          );
          // deleted is not really defined
          // so we'll use the helper to ensure
          // reactivity is detected
          this.$set(this.item.data, 'deleted', !deleted);
        } catch (err) {
          console.error(err);
          this.error = err;
        } finally {
          await minWait;
          this.busy = false;
          this.prompted = false;
        }
      } else {
        this.prompted = true;
      }
    },
  },
};
</script>

<style lang="sass">
.btn-delete
  cursor: pointer
</style>
