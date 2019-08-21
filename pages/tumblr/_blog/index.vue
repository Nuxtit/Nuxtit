<template lang="pug">
  .container
    .row
      .col
        | {{ blog.name }}
    .row
      .col
        pre: code: tt {{ {blog} }}
</template>

<script>
export default {
  middleware: ['auth'],
  props: {
    blog: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="sass"></style>
