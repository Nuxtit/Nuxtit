<template lang="pug">
  form(@submit.prevent.stop)
    h2(v-if="adding") Adding New Endpoint
    h2(v-if="editing") Editing {{ editing }}
    .row: .col.form-group
      label Name
      b-form-input(
        name="name"
        v-model="name"
        :disabled="!!editing"
      )
    .row: .col.form-group
      label API URL
      b-form-input(
        name="api_url"
        v-model="form.api_url"
        placeholder="https://"
      )
    .row: .col.form-group
      label Stats Path
      b-form-input(
        name="stats_path"
        v-model="form.stats_path"
        placeholder="stats"
      )
      p
        | The stats endpoint providers a summary of the other 3.
        | Stats is required, at least one of (items, comments, posts) is also required
    .row: .col.form-group
      label Items Path
      b-form-input(
        name="items_path"
        v-model="form.items_path"
        placeholder="items"
      )
    .row
      .col: .btn-group
        button.btn.btn-secondary(v-if="!adding" @click="destroy")
          i.fa.fa-fw.fa-btn.fa-trash
          | &nbsp;Delete
      .col: .btn-group
        button.btn.btn-primary(@click="save")
          i.fa.fa-fw.fa-btn.fa-floppy
          template(v-if="adding") &nbsp;Save
          template(v-if="editing") &nbsp;Update
        button.btn.btn-secondary(@click="$emit('close')")
          i.fa.fa-fw.fa-btn.fa-cancel
          | &nbsp;Cancel
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex';
// import busyUntil from '~/mixins/busyUntil';

export default {
  components: {},
  props: {
    adding: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: String,
      default: null,
    },
  },
  // mixins: [busyUntil],
  data() {
    return {
      name: '',
      form: {},
    };
  },
  computed: {
    ...mapGetters('pipes', ['endpoints']),
  },
  watch: {
    adding: 'resetForm',
    editing: 'resetForm',
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    ...mapActions('pipes', ['deleteEndpoint', 'saveEndpoints']),
    save() {
      this.saveEndpoints({
        [this.name]: this.form,
      });
      this.$emit('close');
    },
    destroy() {
      this.deleteEndpoint(this.name);
      this.$emit('close');
    },
    resetForm() {
      this.name = this.editing || '';
      const endpoint = this.endpoints[this.editing];
      this.form = {
        api_url: get(endpoint, 'api_url') || '',
        stats_path: get(endpoint, 'stats_path') || '',
        items_path: get(endpoint, 'items_path') || '',
      };
    },
  },
};
</script>
