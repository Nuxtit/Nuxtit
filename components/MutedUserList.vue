<template lang="pug">
  .muted-users-list
    MutedUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import MutedUserEntry from '~/components/MutedUserEntry';

export default {
  name: 'MutedUserList',
  components: {
    MutedUserEntry,
  },
  props: {
    users: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
