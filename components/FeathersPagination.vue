<template lang="pug">
.btn-group
  nuxt-link.btn.btn-primary(v-disabled="!(skip > 0)" :to="prevPath")
    | Prev
  nuxt-link.btn.btn-primary(v-disabled="collection.data.length !== limit" :to="nextPath")
    | Next
</template>

<script>
export default {
  name: 'FeathersPagination',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  computed: {
    skip() {
      return parseInt(this.$route.query.$skip) || this.collection.skip || 0;
    },
    limit() {
      return Math.max(
        1,
        Math.min(
          25,
          parseInt(this.$route.query.$limit) || this.collection.limit || 25,
        ),
      );
    },
    prevPath() {
      return this.$mergeRouteQuery({
        $skip: Math.max(0, this.skip - this.limit),
      });
    },
    nextPath() {
      return this.$mergeRouteQuery({
        $skip: Math.max(0, this.skip + this.limit),
      });
    },
  },
};
</script>
