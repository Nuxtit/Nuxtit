<template lang="pug">
  .banned-users-list
    ModLogEntry(
      v-for='log in items.data.children'
      :log='log'
      :key='log.data.id'
    )
</template>

<script>
import ModLogEntry from '~/components/ModLogEntry';

export default {
  name: 'ModLogList',
  components: {
    ModLogEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
