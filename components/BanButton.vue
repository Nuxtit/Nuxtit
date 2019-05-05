<template lang="pug">
  span.btn-ban(
    v-disabled="busy || isBanned"
    :class='classes'
    @click.stop.prevent="prompt"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-ban(v-else)
    span(v-if='busy && isBanned') unbanning
    span(v-else-if='busy && !isBanned') banning
    span(v-else-if='isBanned') banned
    span(v-else) ban
    b-modal(
      v-model="showingBanModal"
      title="Ban User"
      size="md"
      no-close-on-backdrop
      scrollable
      lazy
      @click.stop.prevent
    )
      .alert.alert-warning(v-if="existingBan")
        | {{ name }} is already banned!
        | &#32;
        TimeAgo(:value="existingBan.date")
        | &#32;
        b-badge(v-if="existingBan.note")
          | note: {{ existingBan.note }}
      template(v-if="!existingBan")
        .form-group
          label who to ban:
          b-form-input(
            v-model="name"
          )
        .form-group
          b-select(v-model="selectedReason")
            optgroup(label="Subreddit Rules" v-if="rules && rules.length")
              option(
                v-for="(rule, index) in rules"
                :value="rule"
                v-text="rule.short_name || rule.violation_reason"
              )
            optgroup(label="Site Rules" v-if="site_rules && site_rules.length")
              option(
                v-for="(rule, index) in site_rules"
                :value="rule"
                v-text="rule"
              )
            option(
              value="other"
              v-text="'other'"
            )
          .alert.alert-info(v-if="selectedReason && selectedReason.description_html" v-html="selectedReason.description_html")
        .form-group
          label duration:
          b-form-input(
            v-model="duration"
          )
          em.text-muted 1 to 999, blank is permanent
        .form-group
          label Mod Log Note:
          b-form-input(
            v-model="note"
          )
        .form-group
          label Ban Message:
          b-form-textarea(
            v-model="ban_message"
          )
        .alert.alert-success(
          v-if="success"
          v-text="success"
        )
        .alert.alert-danger(
          v-if="error"
        )
          tt: pre(
            v-text="error"
          )
        .w-100(slot="modal-footer")
          .btn-group.float-right
            b-button(
              v-if="!success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="showingBanModal=false"
            ) CANCEL
            b-button(
              v-if="success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="showingBanModal=false"
            ) DONE
            b-button(
              v-if="!success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="ban"
            ) BAN
            //- b-button(
            //-   v-if="success"
            //-   v-disabled="busy"
            //-   size="sm"
            //-   variant="primary"
            //-   @click="ban"
            //- ) UNBAN
</template>

<script>
import isString from 'lodash/isString';
import { startMinWait } from '~/lib/sleep';
import TimeAgo from '~/components/TimeAgo';
// ban is the moderator action of banning a user from subreddit participation

export default {
  name: 'BanButton',
  components: {
    TimeAgo,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      busy: false,
      success: null,
      error: null,
      showingBanModal: false,
      rules: null,
      site_rules: null,
      existingBan: null,
      selectedReason: null,

      name: null,
      duration: null,
      note: null,
      ban_message: null,
    };
  },
  computed: {
    isBanned() {
      if (this.item.isRedusaBanned) {
        return true;
      }
      return false;
    },
    classes() {
      return {
        'text-success': this.isBanned,
      };
    },
  },
  methods: {
    async prompt($event) {
      if (this.showingBanModal) return;
      const { item } = this;
      const { subreddit, name } = this.item.data;
      const responses = {};

      try {
        this.busy = true;
        this.showingBanModal = true;

        this.name = this.item.data.author;

        // check if already banned
        const bannedListReponse = await this.$reddit.get(
          `/r/${subreddit}/about/banned`,
          {
            params: {
              user: this.name,
            },
          },
        );

        this.existingBan = bannedListReponse.data.data.children[0];

        const srRulesResponse = await this.$reddit.get(
          `/r/${subreddit}/about/rules`,
        );

        this.rules = srRulesResponse.data.rules;
        this.site_rules = srRulesResponse.data.site_rules;

        this.selectedReason = this.rules[0] || this.site_rules[0];
      } finally {
        this.busy = false;
      }
    },
    async ban(payload) {
      const { isRedusaBanned } = this.item;
      const { author, subreddit } = this.item.data;
      const minWait = startMinWait();

      const ban_reason = (() => {
        if (this.selectedReason) {
          if (this.selectedReason.violation_reason) {
            return this.selectedReason.violation_reason;
          }
          if (isString(this.selectedReason)) {
            return this.selectedReason;
          }
        }
        return null;
      })();

      try {
        this.busy = true;
        const response = await this.$reddit.post(`/r/${subreddit}/api/friend`, {
          // ban_context: 'fullname of a thing' // we'll assuem subreddit fullname for now
          // ban_context: subreddit_id,
          // ban_message: 'markdown to pm to le banned user'
          ban_message: this.ban_message,
          // ban_reason: 'up to 100 characters, usually straight from rule.violation_reason'
          ban_reason,
          // container: ???
          // duration: an integer between 1 and 999,
          duration: this.duration,
          // name: 'le banned username',
          name: this.name,
          // note: 'private note for mod team',
          note: this.note,
          api_type: 'json',
          type: 'banned',
        });
        this.item.isRedusaBanned = !isRedusaBanned;

        this.success = 'Banned!';
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        await minWait;
        this.busy = false;
      }
    },
  },
};
</script>

<style lang="sass">
.btn-remove
  cursor: pointer
</style>
