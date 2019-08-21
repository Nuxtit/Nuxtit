<template lang="pug">
  .approved-users-list
    ApprovedUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import ApprovedUserEntry from '~/components/ApprovedUserEntry';

export default {
  name: 'ApprovedUserList',
  components: {
    ApprovedUserEntry,
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
