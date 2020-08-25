<template lang="pug">
  div
    h2
      | Wiki Page {{ page.path }}
      button(v-if="page.may_revise && !form" @click.prevent.stop="toggleEditing") Edit
    div(v-if="form")
      b-form-textarea(v-model="form.content_md" :rows=10)
      br
      b-form-input(v-model="form.reason" placeholder="edit reason")
      br
      button.btn.btn-success(@click.prevent.stop="save" v-disabled="page.content_md === form.content_md")
        i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='saving')
        i.fa.fa-fw.fa-btn.fa-floppy(v-else)
        template(v-if='saving') Saving
        template(v-else) Save
      button.btn.btn-danger(@click.prevent.stop="toggleEditing") cancel
    ItemHtml(v-else :value="page.content_html")
</template>

<script>
import ItemHtml from '~/components/ItemHtml';

export default {
  middleware: ['auth'],
  components: {
    ItemHtml,
  },
  data() {
    return {
      saving: false,
      form: null,
    };
  },
  async asyncData({ reddit, route }) {
    const { subreddit, pathMatch } = route.params;
    const page = (await reddit.get(`/r/${subreddit}/wiki/${pathMatch}`)).data
      .data;
    page.path = pathMatch;
    console.log(page);

    return {
      page,
    };
  },
  mounted() {
    this.toggleEditing();
  },
  methods: {
    toggleEditing() {
      if (this.form) {
        this.form = null;
      } else {
        this.form = {
          content_md: this.page.content_md,
          reason: '',
        };
      }
    },
    async save() {
      if (!this.form) return;
      try {
        this.saving = true;
        await this.$reddit.post(`/r/${subreddit}/api/wiki/edit`, {
          page: this.page.path,
          content: this.form.content_md,
          reason: this.form.reason || void 0,
          previous: this.page.revision_id,
        });
        this.form = null;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
