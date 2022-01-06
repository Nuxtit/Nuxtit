<template lang="pug">
  div
    h3 Settings
    b-nav(tabs)
      b-nav-item(
        exact
        to='/nuxtit/settings'
      ) general
      b-nav-item(
        to='/nuxtit/settings/accounts'
      ) accounts
      b-nav-item(
        to='/nuxtit/settings/masstagger'
      ) masstagger
      b-nav-item(
        to='/nuxtit/settings/usertags'
      ) tags
      b-nav-item(
        to='/nuxtit/settings/tumblr'
      ) tumblr
      b-nav-item(
        to='/nuxtit/settings/pipes'
      ) pipes
    hr
    nuxt-child
</template>

<script>
import { BindSettings } from '~/lib/settings';

export default {
  middleware: ['auth'],
  components: {
  },
};
</script>

<style lang="sass"></style>
