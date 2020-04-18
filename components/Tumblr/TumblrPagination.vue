<template lang="pug">
.btn-group
  nuxt-link.btn.btn-primary(v-disabled="!(offset > 0)" :to="prevPath") 
    | Prev
  nuxt-link.btn.btn-primary(v-disabled="items.length !== perPage" :to="nextPath")
    | Next
</template>

<script>
export default {
  name: 'TumblrPagination',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    offset() {
      return parseInt(this.$route.query.offset) || 0;
    },
    perPage() {
      return Math.max(1, Math.min(20, parseInt(this.$route.query.limit) || 20));
    },
    prevPath() {
      return this.$mergeRouteQuery({
        offset: Math.max(0, this.offset - this.perPage),
      });
    },
    nextPath() {
      return this.$mergeRouteQuery({
        offset: Math.max(0, this.offset + this.perPage),
      });
    },
  },
};
</script>
