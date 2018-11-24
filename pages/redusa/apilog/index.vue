<template lang="pug">
  .apilog-list
    ApilogEntry(
      v-for='(item, index) in list'
      :key='item.timestamp'
      :item='item'
    )
    ul
      li(v-for='(item, index) in list')
        | {{ {index, item} }}
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
