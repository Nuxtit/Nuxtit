<template lang="pug">
  .container
    .row
      .col
        .form-group.tumblr-fetch-blogs
          button.btn.btn-primary(
            @click.stop.prevent='busyUntil(fetchUserInfo())'
          )
            | Fetch User Info
            i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
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
import busyUntil from '~/mixins/busyUntil';

export default {
  middleware: ['auth'],
  components: {
    MyBlogList,
  },
  mixins: [busyUntil],
  methods: {
    ...mapActions('tumblr', ['fetchUserInfo']),
  },
};
</script>
