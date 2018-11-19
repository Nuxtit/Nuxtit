<template>
  <section class="container">
    Redirecting...
    <!-- <LoginForm /> -->
  </section>
</template>

<script>
// import LoginForm from '~/components/LoginForm.vue';
import { getOAuthLoginHref } from '~/plugins/reddit';

export default {
  middleware: ['guest'],
  mounted() {
    window.location = getOAuthLoginHref();
  },
};
</script>

<style>
</style>
