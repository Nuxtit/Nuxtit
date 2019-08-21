<template lang="pug">
  nuxt-link(
    :class='classes'
    :to='`/me/m/${name}`'
    v-text='`/me/m/${name}`'
  )
</template>

<script>
export default {
  name: 'MultiLink',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    classes() {
      return `mrl-${this.name}`;
    },
  },
};
</script>

<style lang="sass"></style>
