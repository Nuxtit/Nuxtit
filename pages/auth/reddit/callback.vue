<template lang="pug">
  section.container
    | Signing In...
    br
    i.fa.fa-spinner.fa-spin
</template>

<script>
export default {
  // middleware: ['guest'],
  computed: {
    //
  },
  async mounted() {
    const { state, code, error } = this.$route.query;
    await this.$store.dispatch('auth/setCurrent', null);
    await this.$store.dispatch('auth/fetchAccessToken', { state, code, error });
    const MeData = await this.$store.dispatch('auth/fetchMe');
    await this.$store.dispatch('auth/moveTmpOAuthData', MeData.name);
    await this.$store.dispatch('auth/setCurrent', MeData.name);
    this.$router.push('/');
  },
};
</script>

<style>
</style>
