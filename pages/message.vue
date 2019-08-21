<template lang="pug">
  div
    h3 Messages
    b-nav(tabs)
      b-nav-item(
        to='/message/inbox'
      ) all
      b-nav-item(
        to='/message/unread'
      ) unread
      //- b-nav-item(
      //-   to='/message/comments'
      //- ) comment replies
      //- b-nav-item(
      //-   to='/message/selfreply'
      //- ) post replies
      //- b-nav-item(
      //-   to='/message/mentions'
      //- ) username mentions
      b-nav-item(
        to='/message/sent'
      ) sent
      //- b-nav-item(
      //-   to='/message/compose'
      //- ) compose
      //- b-nav-item(
      //-   to='/message/moderator'
      //- ) moderator mail
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

<style lang="sass"></style>
