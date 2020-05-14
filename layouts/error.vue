<template lang="pug">
.container
  h1(v-if='error.statusCode === 404') Page not found
  h1(v-else-if='error.statusCode === 403') Forbidden
  h1(v-else-if='error.statusCode === 401') Unauthenticated
  h1(v-else) An error occurred
  br
  p
    | {{ error.statusCode }}
    | {{ error.message }}
  p(v-if='errorData'): pre(v-text='errorData')
  p
    | {{ (error) }}
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
  computed: {
    errorData() {
      const { error } = this;
      let data =
        (error.response && error.response.data) ||
        (error.res && error.res.data) ||
        error.data;
      if (data) {
        try {
          data = JSON.stringify(data, null, 2);
        } catch (err) {
          //eslint-disable-next-line
           console.error(err);
        }
      }
      return data;
    },
  },
};
</script>
