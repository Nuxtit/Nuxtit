<template lang="pug">
  .history-list
    | todo history-list
    HistoryEntry(
      v-for='(item, index) in list'
      :key='item.timestamp'
      :item='item'
    )
    ul
      li(v-for='(item, index) in list')
        | {{ {index, item} }}
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
