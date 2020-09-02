<template lang="pug">
  div
    h2 All Submissions Grouped By unique Link URL
    template(v-if="loading")
      | batch: {{ loading }}&#32;
      i.fa.fa-spinner.fa-spin
    PostsGroupedByLinks(v-if="items" :items='{ "data.children": items}')
    div.alert.alert-danger(v-if="errorMsg" v-text="errorMsg")
</template>

<script>
import get from 'lodash/get';
import PostsGroupedByLinks from '~/components/PostsGroupedByLinks.vue';

export default {
  middleware: ['auth'],
  components: {
    PostsGroupedByLinks,
  },
  data() {
    return {
      items: null,
      errorMsg: null,
      loading: 0,
    };
  },
  async mounted() {
    const { username } = this.$route.params;
    const limit = 100;
    this.items = [];
    try {
      this.loading = 0;

      let batch = null;
      let res = null;
      let after = null;
      do {
        this.errorMsg = null;
        this.loading++;
        try {
          res = await this.$reddit.get(`/user/${username}/submitted`, {
            params: {
              limit,
            },
          });
        } catch (err) {
          this.errorMsg = err.message || err;
          try {
            this.loading++;
            res = await this.$reddit.get(`/user/${username}/submitted`, {
              params: {
                limit,
              },
            });
          } catch (err) {
            this.errorMsg = err.message || err;
            // give up on double error
            return;
          }
        }
        after = get(res, 'data.data.after') || null;
        batch = get(res, 'data.data.children') || [];
        this.items = [...this.items, ...batch];
      } while (after && batch && batch.length < limit);
    } finally {
      this.loading = 0;
    }
  },
};
</script>
