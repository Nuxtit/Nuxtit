<template lang="pug">
  .container
    br
    .alert.alert-danger(v-show="user.is_suspended") This account has been suspended
</template>

<script>
export default {
  middleware: ['auth'],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  mounted () {
    if (!this.user.is_suspended) {
      this.$router.push({
        ...this.$route,
        name: 'user-username-overview',
      })
    }
  }
};
</script>

<style></style>
    
