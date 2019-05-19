<template lang="pug">
  div
    b-select(
      name='username'
      :options='usernames'
      :value='value'
      @change="$emit('change', $event)"
      @input="$emit('input', $event)"
    )
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SelectAuthUsername',
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters('auth', ['usernames', 'username']),
  },
  mounted() {
    if (this.value === null) {
      this.$emit('input', this.username);
    }
  },
};
</script>

<style>
</style>
