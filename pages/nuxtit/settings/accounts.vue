<template lang="pug">
  .container
    .btn-group.pull-right
      a.btn.btn-success(
        :href="getOAuthLoginHref()"
        rel="nofollow"
        @click.prevent.stop="addNewAccount"
      )
        i.fa.fa-fw.fa-plus
        | Add
      button.btn.btn-success(
        @click.prevent.stop="refetchAll"
      )
        i.fa.fa-fw.fa-arrows-cw
        | All
    br
    table.table.table-sm
      thead
        tr
          th
          th
          th username
          th
          th
          th
      tbody
        tr(
          v-for="({ MeData: md }, username) in list"
          :key="username"
          :class="{'bg-danger': md.is_suspended}"
        )
          td
            template(v-if="isCurrentUser(username)")
              button.btn.btn-default.btn-sm.disabled
                i.fa.fa-fw.fa-star
            template(v-else)
              button.btn.btn-default.btn-sm(@click.prevent.stop="logout(username)")
                i.fa.fa-fw.fa-cancel
          td: img(:src="md.icon_img" width="64" height="64")
          td
            nuxt-link(:to="`/user/${username}`") {{ username }}
            br
            small verified: {{ md.verified }}
          td.text-right
            table.table.table-sm.small: tbody
              tr
                th Link Karma
                td {{ md.link_karma }}
              tr
                th Comment Karma
                td {{ md.comment_karma }}
              tr
                th
                  i.fa.fa-btn.fa-mail
                  | inbox_count
                td {{ md.inbox_count }}
              tr(v-if="md.new_modmail_exists")
                th
                  i.fa.fa-btn.fa-mail
                  nuxt-link(to="/mod/mail?state=default") new_modmail_exists
                td {{ md.new_modmail_exists }}
          td
            small fetchedAt:&#32;
            TimeAgo(:value="md.fetchedAt")
            br
            small createdAt:&#32;
            TimeAgo(:value="md.created_utc")
          td
            button.btn.btn-primary.btn-sm(
              v-disabled="fetching[username]"
              @click.prevent.stop="refetchMe(username)"
            )
              i.fa.fa-fw.fa-arrows-cw
            template(v-if="!isCurrentUser(username)")
              br
              br
              button.btn.btn-primary.btn-sm(@click.prevent.stop="setCurrent(username)")
                i.fa.fa-fw.fa-login
</template>

<script>
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import { mapGetters, mapActions } from 'vuex';
import TimeAgo from '~/components/TimeAgo';
import { BindSettings } from '~/lib/settings';
import { getOAuthLoginHref } from '~/plugins/reddit';

export default {
  // middleware: ['auth'],
  components: {
    bNav,
    bNavItem,
    TimeAgo,
  },
  data() {
    return {
      fetching: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['list', 'username']),
  },
  methods: {
    getOAuthLoginHref,
    ...mapActions('auth', ['fetchMe', 'setCurrent', 'logout']),
    isCurrentUser(username) {
      return this.username === username;
    },
    async refetchMe(username) {
      try {
        this.$set(this.fetching, username, true);
        await this.fetchMe(username);
      } finally {
        this.$set(this.fetching, username, false);
      }
    },
    async addNewAccount() {
      await this.setCurrent(null);
      window.location = getOAuthLoginHref();
    },
    async refetchAll() {
      for (let username in this.list) {
        await this.refetchMe(username);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
  },
};
</script>

<style lang="sass"></style>
