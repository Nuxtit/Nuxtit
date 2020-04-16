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
    b-modal(
      v-model="showingContributorModal"
      title="Contributor User"
      size="md"
      no-close-on-backdrop
      scrollable
      lazy
      @click.stop.prevent
    )
      .alert.alert-warning(v-if="existingContributor")
        | {{ name }} is already contributorned!
        | &#32;
        TimeAgo(:value="existingContributor.date")
        | &#32;
        b-badge(v-if="existingContributor.note")
          | note: {{ existingContributor.note }}
      nuxt-link(:to="`/r/${item.data.subreddit}/about/contributors`") Contributors Page
      template(v-if="!existingContributor")
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
        .w-100(slot="modal-footer")
          .btn-group.float-right
            b-button(
              v-if="!success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="showingContributorModal=false"
            ) CANCEL
            b-button(
              v-if="success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="showingContributorModal=false"
            ) DONE
            b-button(
              v-if="!success"
              v-disabled="busy"
              size="sm"
              variant="primary"
              @click="contributor"
            ) ADD
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
      showingContributorModal: false,
      existingContributor: null,

      name: null,
      duration: null,
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
      if (this.showingContributorModal) return;
      const { item } = this;
      const { subreddit, name } = this.item.data;
      const responses = {};

      try {
        this.busy = true;
        this.showingContributorModal = true;

        this.name = this.item.data.author;

        // check if already contributorned
        const contributornedListReponse = await this.$reddit.get(
          `/r/${subreddit}/about/contributors`,
          {
            params: {
              user: this.name,
            },
          },
        );

        this.existingContributor =
          contributornedListReponse.data.data.children[0];
      } finally {
        this.busy = false;
      }
    },
    async contributor(payload) {
      const { isRedusaContributorned } = this.item;
      const { author, subreddit } = this.item.data;
      const minWait = startMinWait();

      try {
        this.busy = true;
        const response = await this.$reddit.post(`/r/${subreddit}/api/friend`, {
          // name: 'le contributorned username',
          name: this.name,
          api_type: 'json',
          type: 'contributor',
        });
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
