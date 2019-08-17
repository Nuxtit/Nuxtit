<template lang="pug">
  .container
    .pull-right
      button.btn.btn-success(
        @click.prevent.stop="addNewAccount"
      )
        i.fa.fa-fw.fa-plus
        | Add
    br
    table.table
      thead
        tr
          th
          th
          th username
          th inbox_count
          th karma
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
              i.fa.fa-fw.fa-star
              i.fa.fa-fw.fa-logout(@click.prevent.stop="setCurrent(null)")
            template(v-else)
              i.fa.fa-fw.fa-login(@click.prevent.stop="setCurrent(username)")
              i.fa.fa-fw.fa-cancel(@click.prevent.stop="logout(username)")
          td: img(:src="md.icon_img" width="64" height="64")
          td
            nuxt-link(:to="`/user/${username}`") {{ username }}
            br
            small verified: {{ md.verified }}
          td.text-right
            | {{ md.inbox_count }}
            template(v-if="md.has_mod_mail")
              br
              small has_mod_mail: {{ md.has_mod_mail }}
          td.text-right: small
            | Link: {{ md.link_karma }}
            br
            | Comment: {{ md.comment_karma }}
          td
            small fetchedAt:&#32;
            TimeAgo(:value="md.fetchedAt")
            br
            small createdAt:&#32;
            TimeAgo(:value="md.created_utc")
          td
            button.btn.primary.btn-sm(
              v-disabled="fetching[username]"
              @click.prevent.stop="refetchMe(username)"
            )
              i.fa.fa-fw.fa-arrows-cw
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
  },
};
</script>

<style lang="sass">
</style>
