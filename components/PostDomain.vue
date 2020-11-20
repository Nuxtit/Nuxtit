<template lang="pug">
  nuxt-link.small.text-monospace(
    v-if='post.data.domain'
    :to='post.data.is_self ? `/r/${post.data.domain}` : `/domain/${post.data.domain}`'
    v-text='`(${post.data.domain})`'
  )
</template>

<script>
export default {
  name: 'PostDomain',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  // data() {
  //   return {
  //   };
  // },
};
</script>
