<template lang="pug">
  .wikicontributor-users-list
    WikiContributorUserEntry(
      v-for='user in users.data.children'
      :user='user'
      :key='user.name'
    )
</template>

<script>
import WikiContributorUserEntry from '~/components/WikiContributorUserEntry';

export default {
  name: 'WikiContributorUserList',
  components: {
    WikiContributorUserEntry,
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
