<template lang="pug">
  section.container
    | Signing In...
    br
    i.fa.fa-spinner.fa-spin
</template>

<script>
export default {
  computed: {
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
  },
  async mounted() {
    const { state, code, error } = this.$route.query;
    await this.$store.dispatch('auth/fetchAccessToken', { state, code, error });
    await this.$store.dispatch('auth/fetchMe');
    this.$router.push('/');
  },
};
</script>

<style>
</style>
