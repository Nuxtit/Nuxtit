<template lang="pug">
  .queue-list
    .btn-group
      .btn.btn-danger(
        @click.prevent.stop='$store.dispatch("queue/flush")'
      )
        | Flush Queue
      .btn.btn-primary(
        v-if='list.length > 1'
        @click.prevent.stop='$store.dispatch("queue/reverse")'
      )
        | Reverse Entries
      .btn.btn-secondary(
        v-if='list.length > 1'
        @click.prevent.stop='$store.dispatch("queue/shuffle")'
      )
        i.fa.fa-fw.fa-shuffle
        | Shuffle
    hr
    h6 queue
    QueueEntry(
      v-for='(item, index) in list'
      :key='item.name+item.createdAt'
      :item='item'
    )
    hr
    h6 done
    QueueEntry(
      v-for='(item, index) in doneList'
      :key='item.name+item.createdAt'
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
    ...mapGetters('queue', ['list', 'doneList']),
  },
};
</script>

<style lang="sass"></style>
