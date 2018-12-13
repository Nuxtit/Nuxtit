<template lang="pug">
  span redirecting to /message/inbox
</template>

<script>
export default {
  beforeMount() {
    this.$router.replace('/message/inbox');
  },
};
</script>
