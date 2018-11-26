<template lang="pug">
  .multis-list
    MultiEntry(
      v-for='multi in multis.data.children'
      :multi='multi'
      :key='multi.data.name'
    )
</template>

<script>
import MultiEntry from '~/components/MultiEntry';

export default {
  name: 'MultiList',
  components: {
    MultiEntry,
  },
  props: {
    multis: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
