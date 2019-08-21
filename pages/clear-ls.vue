<template lang="pug">
  section.container
    | Clearing...
</template>

<script>
import sleep from '~/lib/sleep';

export default {
  // middleware: ['auth'],
  async mounted() {
    window.localStorage.clear();
    await sleep(2000);
    window.location = '/';
  },
};
</script>

<style></style>
