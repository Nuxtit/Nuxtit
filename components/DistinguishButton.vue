<template lang="pug">
  span.btn-distinguish(
    v-disabled="busy || isDistinguishned"
    :class='classes'
    @click.stop.prevent="prompt"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-plus(v-else)
    .alert.alert-info(v-if='existingDistinguish') already a distinguish
    span(v-if='busy && isDistinguishned') undistinguishning
    span(v-else-if='busy && !isDistinguishned') distinguishning
    span(v-else-if='isDistinguishned') distinguishned
    span(v-else) distinguish
    div(
      v-if="showingDistinguishForm"
      @click.stop.prevent
    )
      h2 Distinguish User
      span It is safe to add a user who is already a distinguish
      nuxt-link(
        v-if="add_subreddit"
        :to="`/r/${add_subreddit}/about/distinguishs`"
      ) Distinguishs Page
      .form-group
        label subreddit:
        b-form-input(
          v-model="add_subreddit"
        )
      .form-group
        label who to distinguish:
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
        pre.text-monospace(
          v-text="error"
        )
      .w-100
        .btn-group.float-right
          b-button(
            v-if="!success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="showingDistinguishForm=false"
          ) CANCEL
          b-button(
            v-if="success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="showingDistinguishForm=false"
          ) DONE
          b-button(
            v-if="!success"
            v-disabled="busy"
            size="sm"
            variant="primary"
            @click="distinguish"
          ) ADD
      br
</template>

<script>
import isString from 'lodash/isString';
import { startMinWait } from '~/lib/sleep';
import TimeAgo from '~/components/TimeAgo';
// distinguish adds a sigil, usually to indicate moderator or admin

export default {
  name: 'DistinguishButton',
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
      showingDistinguishForm: false,
      existingDistinguish: null,

      name: null,
      add_subreddit:
        this.item && this.item
          ? this.item.can_mod_post
            ? this.item.subreddit
            : ''
          : '',
    };
  },
  computed: {
    isDistinguishned() {
      if (this.item.isRedusaDistinguishned) {
        return true;
      }
      return false;
    },
    classes() {
      return {
        'text-success': this.isDistinguishned,
      };
    },
  },
  methods: {
    async prompt($event) {
      this.showingDistinguishForm = true;
    },
    async distinguish(payload) {
      const { add_subreddit } = this;
      const { isRedusaDistinguishned } = this.item;
      const { author } = this.item;
      const minWait = startMinWait();

      try {
        this.busy = true;
        const response = await this.$reddit.post(
          `/r/${add_subreddit}/api/friend`,
          {
            // name: 'le distinguishned username',
            name: this.name,
            api_type: 'json',
            type: 'distinguish',
          },
        );
        this.item.isRedusaDistinguishned = !isRedusaDistinguishned;

        this.success = 'Distinguishned!';
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
