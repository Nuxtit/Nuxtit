<template lang="pug">
  span.btn-hide(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="prompt"
  )
    i.fa.fa-fw.fa-btn.fa-megaphone
    | &#32;report
    div(
      v-if="showingReportForm"
    )
      h2 Report Content
      .form-group.sub-rules(@click.stop)
        b-form-radio-group(
          v-if="rulestable"
          v-model="selectedReason"
        )
          label Site Rules
          b-form-radio.w-100(
            v-for="(rule, index) in rulestable.filter(r => r.kind === 'Site')"
            :value="rule"
            :key="`${rule.kind}-${rule.short_name}`"
            :title="JSON.stringify(rule, null, 2)"
          ) {{ rule.violation_reason }}
          label r/{{ item.data.subreddit }} Rules
          b-form-radio.w-100(
            v-for="(rule, index) in rulestable.filter(r => r.kind !== 'Site')"
            :value="rule"
            :key="`${rule.kind}-${rule.short_name}`"
            :title="JSON.stringify(rule, null, 2)"
          )
            | {{ rule.violation_reason || rule.short_reason }}
            small.text-muted(v-if="rule.description") &nbsp;- {{ rule.description }}
          b-form-radio.w-100(
            value="other"
          ) Other:
          b-form-input(
            v-model="other_reason",
            v-disabled="selectedReason !== 'other'"
            placeholder="max 100 characters"
          )
          p(
            v-if="selectedReason !== 'other' && other_reason"
            v-show="other_reason.length > 50"
            :class="(other_reason||'').length > 100 ? 'text-danger' : ''"
          ) {{ (other_reason||'').length }}/100
      pre.text-monospace(
        v-text="'/api/report '+JSON.stringify(jsonPayload, null, 2)"
      )
      .alert.alert-success(
        v-if="completeMsg"
        v-text="completeMsg"
      )
      .alert.alert-danger(
        v-if="completeErr"
      )
        pre.text-monospace(
          v-text="completeErr"
        )
      .w-100(slot="modal-footer" @click.stop)
        .btn-group.float-right
          b-button(
            v-if="!completeMsg"
            size="sm"
            variant="primary"
            @click="showingReportModal=false"
          ) CANCEL
          b-button(
            v-if="completeMsg"
            size="sm"
            variant="primary"
            @click="showingReportModal=false"
          ) DONE
          b-button(
            v-if="showReportModalSubmit"
            v-disabled="disableReportModalSubmit"
            size="sm"
            variant="primary"
            @click="reportModalSubmit"
          ) SUBMIT
        .report-form-content-policy
           p(@click.stop)
             | Read the <a target="_blank" href="https://www.reddit.com/help/contentpolicy">Reddit Content Policy</a>
             | and <a target="_blank" :href="`/r/${item.data.subreddit}/about/rules`">r/{{ item.data.subreddit }}'s rules</a>.
</template>

<script>
import get from 'lodash/get';
import { startMinWait } from '~/lib/sleep';
import { site_rules } from '~/lib/rules';

function init_report_state() {
  return {
    step0: null,
    step1: null,
    step: 0,
    rules: [],
    site_rules: [],
    site_rules_flow: [],
    completeErr: null,
    completeMsg: null,
  };
}

export default {
  name: 'ReportButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  site_rules,
  data() {
    return {
      showingReportForm: false,
      busy: false,
      error: null,
      rulestable: null,
      selectedReason: null,
      other_reason: null,
      completeErr: null,
      completeMsg: null,
    };
  },
  computed: {
    classes() {
      return {
        'text-success': this.item.data.hidden === true,
      };
    },
    showReportModalSubmit() {
      if (this.completeMsg) return false;
      return true;
    },
    showReportModalNext() {
      if (this.completeMsg) return false;
      if (this.showReportModalSubmit) return false;
      return true;
    },
    disableReportModalSubmit() {
      return false;
    },
    jsonPayload() {
      const { name } = this.item.data;
      if (this.selectedReason === 'other') {
        return {
          api_type: 'json',
          thing_id: name,
          other_reason: this.other_reason,
        };
      } else if (this.selectedReason) {
        return {
          api_type: 'json',
          thing_id: name,
          reason: this.selectedReason.violation_reason, // sub reason
          site_reason:
            this.selectedReason.kind === 'Site'
              ? this.selectedReason.short_name
              : void 0,
        };
      } else {
        return {};
      }
    },
  },
  methods: {
    async reportModalSubmit() {
      this.completeErr = null;
      this.completeMsg = null;

      const { name } = this.item.data;
      const response = await this.$reddit.post('/api/report', this.jsonPayload);
      if (get(response.data, 'json.errors.length')) {
        this.completeErr = response.data.json.errors;
      } else {
        this.completeMsg = 'Thank you for your report!';
      }
      this.item.reported = true;
    },
    async prompt($event) {
      if (this.showingReportForm) return;
      const { item } = this;
      const { subreddit, name } = this.item.data;
      const responses = {};

      const options = {};
      const rulestable = [];
      let charindex = 0;
      let selectedReason = null;
      this.$options.site_rules.forEach(site_rule => {
        const ruleReason = {
          kind: 'Site',
          violation_reason: site_rule,
          short_name: site_rule,
          //description: null,
        };
        rulestable.push(ruleReason);
      });

      const srRulesResponse = await this.$reddit.get(
        `/r/${subreddit}/about/rules`,
      );

      const { rules, site_rules, site_rules_flow } = srRulesResponse.data;

      this.rulestable = [...rulestable];
      /*ruleGroups.*/ rules.forEach(sub_rule => {
        const ruleReason = {
          ...sub_rule,
        };
        rulestable.push(ruleReason);
      });
      console.log({ rulestable });
      this.rulestable = rulestable;

      this.showingReportForm = true;
    },
    resetReportState() {
      this.reportState = init_report_state();
    },
    reportModalNext() {
      this.reportState.step++;
    },
  },
};
</script>

<style lang="sass">
.btn-hide
  cursor: pointer
</style>
