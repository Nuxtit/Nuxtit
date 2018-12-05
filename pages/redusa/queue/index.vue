<template lang="pug">
  .queue-list
    .btn.btn-danger(
      @click.prevent.stop='$store.dispatch("queue/flush")'
    )
      | Flush Queue
    hr
    QueueEntry(
      v-for='(item, index) in list'
      :key='item.createdAt'
      :item='item'
    )
</template>

<script>
import QueueEntry from '~/components/QueueEntry';
import { mapGetters } from 'vuex';

export default {
  components: {
    QueueEntry,
  },
  computed: {
    ...mapGetters('queue', ['list']),
  },
};
</script>

<style lang="sass">

</style>
