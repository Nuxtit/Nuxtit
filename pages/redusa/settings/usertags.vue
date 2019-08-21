<template lang="pug">
  .container
    .row
      .col
        .form-group
          label Username
          b-form-input(
            name="add_username"
            v-model="add_username"
          )
      .col
        .form-group
          label Tag
          b-form-input(
            name="add_tag"
            v-model="add_tag"
          )
      .col
        .form-group
          button.btn.btn-success(
            name="save_tag"
            @click.prevent.stop="save"
          )
           i.fa.fa-fw.fa-plus
           | Save Tag
    .row
      .col
        table.table-sm
          thead
            tr
              th Username
              td Tag
              td
          tbody
            tr(v-for="(tag, username) in items")
              td: UserLink(:username="username")
              td {{ tag }}
              td: button.btn.btn-xs.btn-danger(
                @click.prevent.stop="del(username)"
              )
                i.fa.fa-fw.fa-cancel
</template>

<script>
import UserLink from '~/components/UserLink';
import usertags from '~/lib/usertags';

export default {
  middleware: ['auth'],
  components: {
    UserLink,
  },
  data() {
    return {
      items: {},
      add_username: '',
      add_tag: '',
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async save($event) {
      await usertags.set(this.add_username, this.add_tag);
      this.items[this.add_username] = this.add_tag;
      this.add_username = '';
      this.add_tag = '';
    },
    async del(key) {
      const r = await usertags.del(key);
      this.$delete(this.items, key);
    },
    async fetchItems() {
      const keys = await usertags.keys();
      const data = {};
      for (let i = 0; i < keys.length; i++) {
        const item = await usertags.get(keys[i]);
        if (item && item.length) {
          data[keys[i]] = item;
        }
      }
      this.items = data;
    },
  },
};
</script>

<style lang="sass"></style>
