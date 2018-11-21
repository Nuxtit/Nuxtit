<template lang="pug">
  section.container.home
    div
      h1.title
        | Redusa
      h2.subtitle
        | Nuxt Reddit Client
      .links
        nuxt-link.button--green(v-if='!MeData.name', to='/login') Login
        nuxt-link.button--grey(to='/best') /best
        nuxt-link.button--grey(to='/hot') /hot
        nuxt-link.button--grey(to='/new') /new
        nuxt-link.button--grey(to='/rising') /rising
        nuxt-link.button--grey(to='/controversial') /controversial
        nuxt-link.button--grey(to='/top') /top
        //- nuxt-link.button--grey(to='/gilded') /gilded
        //- nuxt-link.button--grey(to='/wiki') /wiki
      .links
        nuxt-link.button--grey(to='/r/popular') /r/popular
        nuxt-link.button--grey(to='/r/all') /r/all
        nuxt-link.button--grey(to='/r/friends') /r/friends
        nuxt-link.button--grey(to='/random') /random
        nuxt-link.button--grey(to='/subreddits') /subreddits
          //- dont know what /users is for, so come back to it whenever
          //- nuxt-link.button--grey(to='/users') /users
        nuxt-link.button--green(v-if='MeData.name', :to='`/user/${MeData.name}`') /u/{{ MeData.name }}
</template>

<script>
export default {
  middleware: ['auth'],
  computed: {
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
  },
};
</script>

<style>
.container.home {
  min-height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
