<template lang="pug">
.container
  h1(v-if='error.statusCode === 404') Page not found
  h1(v-else-if='error.statusCode === 403') Forbidden
  h1(v-else-if='error.statusCode === 401') Unauthenticated
  h1(v-else) An error occurred
  br
  nuxt-link(to='/') Home page
</template>

<script>
export default {
  props: {
    error: {
      type: [Object, Error],
      required: true,
    },
  },
  // layout: 'blog' // you can set a custom layout for the error page
};
</script>
