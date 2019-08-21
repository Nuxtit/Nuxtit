<template lang="pug">
  .wikibanned-users-list
    WikiBannedUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import WikiBannedUserEntry from '~/components/WikiBannedUserEntry';

export default {
  name: 'WikiBannedUserList',
  components: {
    WikiBannedUserEntry,
  },
  props: {
    users: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
