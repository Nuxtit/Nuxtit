<template lang="pug">
  tt(v-if="username==='[deleted]'" v-text="username")
  nuxt-link(
    v-else
    :to="`/user/${username}`"
    v-text="`/u/${username}`"
    :style='styles'
  )
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserLink',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('settings', ['censorUsernames']),
    styles() {
      if (this.censorUsernames) {
        const color = intToRGB(hashCode(this.username));
        return {
          color: '#' + color,
          backgroundColor: '#' + color,
        };
      }
    },
  },
};

function hashCode(str) {
  // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}
</script>

<style lang="sass"></style>
