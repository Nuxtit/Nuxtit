<template lang="pug">
  .moderator-users-list
    ModeratorUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import ModeratorUserEntry from '~/components/ModeratorUserEntry';

export default {
  name: 'ModeratorUserList',
  components: {
    ModeratorUserEntry,
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
