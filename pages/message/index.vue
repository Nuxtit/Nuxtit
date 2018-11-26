<template lang="pug">
  span redirecting to /message/inbox
</template>

<script>
export default {
  mounted() {
    this.$router.push('/message/inbox');
  },
};
</script>
