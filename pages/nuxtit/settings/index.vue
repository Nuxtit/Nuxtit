<template lang="pug">
  .container
    .form-group.censor-usernames
      label
        b-form-checkbox(
          v-model="censorUsernames"
        )
        | Censor Usernames
</template>

<script>
import { BindSettings } from '~/lib/settings';

export default {
  middleware: ['auth'],
  components: {
  },
  computed: {
    ...BindSettings([
      'censorUsernames',
      // 'icons',
    ]),
  },
};
</script>

<style lang="sass"></style>
