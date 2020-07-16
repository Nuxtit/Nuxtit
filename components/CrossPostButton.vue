<template lang="pug">
  span.btn-cross-post(
    @click.prevent.stop='$emit("click", $event)'
  )
    i.fa.fa-fw.fa-btn.fa-cw
    | &#32;x-post
</template>

<script>
export default {
  name: 'CrossPostButton',
};
</script>

<style lang="sass">
.btn-cross-post
  cursor: pointer
</style>
