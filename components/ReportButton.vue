<template lang="pug">
  span.btn-hide(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="report"
  )
    i.fa.fa-fw.fa-btn.fa-bullhorn
    | &#32;report
</template>

<script>
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'ReportButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      busy: false,
      error: null,
    };
  },
  computed: {
    classes() {
      return {
        'text-success': this.item.data.hidden === true,
      };
    },
  },
  methods: {
    async report($event) {
      const { item } = this;
      const { subreddit, name } = this.item.data;
      const responses = {};
      // responses.is_current_user_subscribed = await this.$reddit.get(
      //   '/api/is_current_user_subscribed.json',
      //   {
      //     params: {
      //       sr_name: subreddit,
      //     },
      //   },
      // );
      // responses.sitewide_rules = await this.$reddit.get('sitewide_rules.json');
      // responses.report_form = await this.$reddit.get('/api/report_form', {
      //   params: {
      //     thing: name,
      //     api_type: 'json',
      //     r: subreddit,
      //     // renderstyle: 'html',
      //   },
      // });

      const srRulesResponse = await this.$reddit.get(
        `/r/${subreddit}/about/rules`,
      );

      const { rules, site_rules, site_rules_flow } = srRulesResponse.data;
      console.log({ rules, site_rules, site_rules_flow });
    },
  },
};
</script>

<style lang="sass">
.btn-hide
  cursor: pointer
</style>
