<template lang="pug">
  div
    h3 Settings
    b-nav(tabs)
      b-nav-item(
        exact
        to='/redusa/settings'
      ) general
      b-nav-item(
        to='/redusa/settings/masstagger'
      ) masstagger
    hr
    nuxt-child
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
};
</script>

<style lang="sass">
</style>
