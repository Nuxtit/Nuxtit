<template lang="pug">
  .apilog-list
    .btn.btn-danger(
      @click.prevent.stop='$store.dispatch("apilog/flush")'
    )
      | Flush API Log
    hr
    ApilogEntry(
      v-for='(item, index) in list'
      :key='item.timestamp'
      :item='item'
    )
</template>

<script>
import ApilogEntry from '~/components/ApilogEntry';
import { mapGetters } from 'vuex';

export default {
  components: {
    ApilogEntry,
  },
  computed: {
    ...mapGetters('apilog', ['list']),
  },
};
</script>

<style lang="sass">

</style>
