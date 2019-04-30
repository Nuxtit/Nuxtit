<template lang="pug">
  span(v-if="noBlogs")
  span.btn-tumblr-share(
  	v-else
    @click.prevent.stop='$emit("click", $event)'
  )
    i.fa.fa-fw.fa-btn.fa-repeat
    span tumblr
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TumblrShareButton',
  computed: {
    ...mapGetters('tumblr', ['noBlogs']),
  },
};
</script>

<style lang="sass">
.btn-tumblr-share
  cursor: pointer
</style>
