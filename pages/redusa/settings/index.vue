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
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import { BindSettings } from '~/lib/settings';

export default {
  middleware: ['auth'],
  components: {
    bNav,
    bNavItem,
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
