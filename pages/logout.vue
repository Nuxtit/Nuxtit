<template lang="pug">
  section.container
    | Redirecting...
</template>

<script>
export default {
  middleware: ['auth'],
  mounted() {
    this.$store.dispatch('auth/logout');
  },
};
</script>

<style>
</style>
