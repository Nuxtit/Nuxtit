<template lang="pug">
  section.container
    | Redirecting...
</template>

<script>
import sleep from '~/lib/sleep';

export default {
  middleware: ['auth'],
  async mounted() {
    await this.$store.dispatch('auth/logout');
    await sleep(2500);
    window.location = '/';
  },
};
</script>

<style>
</style>
