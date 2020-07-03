<template lang="pug">
  span.btn-contributor(
    v-disabled="busy || isContributorned"
    :class='classes'
    @click.stop.prevent="prompt"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-plus(v-else)
    span(v-if='busy && isContributorned') uncontributorning
    span(v-else-if='busy && !isContributorned') contributorning
    span(v-else-if='isContributorned') contributorned
    span(v-else) contributor
    div(
      v-if="showingContributorForm"
      @click.stop.prevent
    )
      h2 Contributor User
      span It is safe to add a user who is already a contributor
      nuxt-link(
        v-if="add_subreddit"
        :to="`/r/${add_subreddit}/about/contributors`"
      ) Contributors Page
      .form-group
        label subreddit:
        b-form-input(
          v-model="add_subreddit"
        )
      .form-group
        label who to contributor:
        b-form-input(
          v-model="name"
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
      .w-100
        .btn-group.float-right
          b-button(
            v-if="!success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="showingContributorForm=false"
          ) CANCEL
          b-button(
            v-if="success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="showingContributorForm=false"
          ) DONE
          b-button(
            v-if="!success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="contributor"
          ) ADD
      br
</template>

<script>
import isString from 'lodash/isString';
import { startMinWait } from '~/lib/sleep';
import TimeAgo from '~/components/TimeAgo';
// contributor is the moderator action of contributorning a user from subreddit participation

export default {
  name: 'AddContributorButton',
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
      showingContributorForm: false,
      existingContributor: null,

      name: null,
      add_subreddit:
        this.item && this.item.data
          ? this.item.data.can_mod_post
            ? this.item.data.subreddit
            : ''
          : '',
    };
  },
  computed: {
    isContributorned() {
      if (this.item.isRedusaContributorned) {
        return true;
      }
      return false;
    },
    classes() {
      return {
        'text-success': this.isContributorned,
      };
    },
  },
  methods: {
    async prompt($event) {
      if (this.showingContributorForm) return;
      const { item, add_subreddit } = this;
      const responses = {};

      try {
        this.busy = true;
        this.showingContributorForm = true;

        this.name = this.item.data.author;

        this.existingContributor = false;
        if (this.add_subreddit) {
          // check if already contributorned
          const contributornedListReponse = await this.$reddit.get(
            `/r/${add_subreddit}/about/contributors`,
            {
              params: {
                user: this.name,
              },
            },
          );

          this.existingContributor =
            contributornedListReponse.data.data.children[0];
        }
      } finally {
        this.busy = false;
      }
    },
    async contributor(payload) {
      const { add_subreddit } = this;
      const { isRedusaContributorned } = this.item;
      const { author } = this.item.data;
      const minWait = startMinWait();

      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/r/${add_subreddit}/api/friend`,
          {
            // name: 'le contributorned username',
            name: this.name,
            api_type: 'json',
            type: 'contributor',
          },
        );
        this.item.isRedusaContributorned = !isRedusaContributorned;

        this.success = 'Contributorned!';
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
