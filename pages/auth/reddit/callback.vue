<template lang="pug">
  section.container
    button.btn.btn-primary.btn-lg(
      :disabled='busy'
      :class="{disabled: busy}"
      @click.prevent.stop='addTokens'
    )
      template(v-if='busy')
        | Signing In...
        br
        i.fa.fa-spinner.fa-spin
      template(v-else)
        i.fa.fa-login
        | Complete Sign-in
</template>

<script>
export default {
  // middleware: ['guest'],
  data() {
    return {
      error: null,
      busy: false,
    };
  },
  methods: {
    async addTokens() {
      try {
        this.busy = true;
        const { state, code, error } = this.$route.query;
        await this.$store.dispatch('auth/setCurrent', null);
        await this.$store.dispatch('auth/fetchAccessToken', {
          state,
          code,
          error,
        });
        const MeData = await this.$store.dispatch('auth/fetchMe');
        await this.$store.dispatch('auth/moveTmpOAuthData', MeData.name);
        await this.$store.dispatch('auth/setCurrent', MeData.name);
        this.$router.push('/');
      } catch (err) {
        console.error(err);
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style></style>
