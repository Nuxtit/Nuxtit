<template lang="pug">
pre: tt: small {{ JSON.stringify(value, null, 2) }}
</template>

<script>
/* eslint vue/require-prop-types: 0 */
export default {
  name: 'ShowSource',
  props: {
    value: {
      default: null,
    },
  },
};
</script>
