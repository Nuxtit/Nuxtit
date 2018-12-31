<template lang="pug">
  div
    h3 Subreddits
    b-nav(tabs)
      b-nav-item(
        exact
        to='/subreddits'
      ) all
      b-nav-item(
        to='/subreddits/search'
      ) search
      b-nav-item(
        to='/subreddits/mine'
      ) mine
      b-nav-item(
        to='/subreddits/new'
      ) new
      //- b-nav-item(
      //-   to='/subreddits/create'
      //- ) create
    hr
    nuxt-child
</template>

<script>
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
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
