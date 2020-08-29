<template lang="pug">
  span.btn-archive(
    v-disabled="busy || item.archived"
    :class='classes'
    @click.stop.prevent="archive"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-check(v-else-if='item.archived')
    span(v-if='busy && item.archived') unarchiving
    span(v-else-if='busy && !item.archived') archiving
    span(v-else-if='item.archived') archived
    span(v-else) archive
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// archive is the moderator action of archiving an item from public visibility

export default {
  name: 'ArchiveButton',
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
        'text-success': this.item.archived === true,
      };
    },
    isArchived() {
      return this.item.archived;
    },
  },
  methods: {
    async archive($event) {
      const { archived, id } = this.item;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const url = `/api/mod/conversation/${id}/${
          archived ? 'unarchive' : 'archive'
        }`;
        const response = await this.$reddit.post(url);
        this.item.archived = true;
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
.btn-archive
  cursor: pointer
</style>
