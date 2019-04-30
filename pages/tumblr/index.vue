<template lang="pug">
  .container
    .row
      .col
        .form-group.tumblr-fetch-blogs
          button.btn.btn-primary(
            @click.stop.prevent='fetchUserInfo'
          )
            | Fetch User Info
        .alert.alert-warning
          | Your user info and blog list will only be updated when you click this button
    .row
      .col
        MyBlogList
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import MyBlogList from '~/components/Tumblr/MyBlogList';
import { mapActions } from 'vuex';

export default {
  middleware: ['auth'],
  components: {
    MyBlogList,
  },
  data() {
    return {
      selected_blog: null,
    };
  },
  computed: {
    //
  },
  methods: {
    ...mapActions('tumblr', ['fetchUserInfo']),
  },
};
</script>

<style lang="sass">
</style>
