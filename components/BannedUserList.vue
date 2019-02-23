<template lang="pug">
  .banned-users-list
    BannedUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import BannedUserEntry from '~/components/BannedUserEntry';

export default {
  name: 'BannedUserList',
  components: {
    BannedUserEntry,
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
