<template lang="pug">
  .history-list
    .btn.btn-danger(
      @click.prevent.stop='$store.dispatch("history/flush")'
    )
      | Flush History
    hr
    HistoryEntry(
      v-for='(item, index) in list'
      :key='item.timestamp'
      :item='item'
    )
</template>

<script>
import HistoryEntry from '~/components/HistoryEntry';
import { mapGetters } from 'vuex';

export default {
  components: {
    HistoryEntry,
  },
  computed: {
    ...mapGetters('history', ['list']),
  },
};
</script>

<style lang="sass">

</style>
