<template lang="pug">
  .container
    .alert.alert-info
      | Note that we are currently unable to distinguish between regular
      | users of a subreddit and outsiders that choose to argue against
      | regular users of subreddit.
    .row
      .col
        .form-group.mt-enable
          label
            b-form-checkbox(
              v-model="mtEnable"
            )
            | Enable
      .col
        .form-group.mt-min
          label
            | Minimum Threshold
          b-form-input(
            v-model="mtMin"
            type='number'
          )
        .form-group.mt-tag-me
          label
            b-form-checkbox(
              v-model="mtTagMe"
            )
            | Tag Myself
        hr
        .form-group.mt-flush-cache
          button.btn.btn-danger(
            @click.stop.prevent='flush'
          )
            | Flush Masstagger Cache
            | &#32;
            small ({{ cachedCount }} users cached)
</template>

<script>
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import { mapActions, mapGetters } from 'vuex';
import { BindSettings } from '~/lib/settings';

export default {
  middleware: ['auth'],
  components: {
    bNav,
    bNavItem,
  },
  computed: {
    ...mapGetters('masstagger', ['cachedCount']),
    ...BindSettings(['mtEnable', 'mtMin', 'mtTagMe']),
  },
  methods: {
    ...mapActions('masstagger', ['flush']),
  },
};
</script>

<style lang="sass"></style>
