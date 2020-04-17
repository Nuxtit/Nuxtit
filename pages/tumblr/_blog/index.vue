<template lang="pug">
  .container
    .row
      .col
        | {{ blog.name }}
    .row
      .col
        ShowSource(:value="{blog}")
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
