<template lang="pug">
  span.btn-hide(
    v-disabled="busy"
    :class='classes'
    @click.stop.prevent="prompt"
  )
    i.fa.fa-fw.fa-btn.fa-bullhorn
    | &#32;report
    b-modal(
      v-model="showingReportModal"
      title="Report Content"
      size="md"
      no-close-on-backdrop
      scrollable
      lazy
      @click.stop.prevent
      @hidden="resetReportState"
    )
      .form-group(@click.stop v-if="reportState.step===0")
        label Reporting Category?
        b-form-radio-group(
          v-model="reportState.step0"
        )
          b-form-radio.w-100(
            :value="-1"
          ) It breaks r/{{ item.data.subreddit }}'s rules
          //- b-form-radio.w-100(
          //-   v-for="(rule, index) in reportState.site_rules"
          //-   :value="index"
          //-   :key="`${index}-${rule}`"
          //- ) {{ rule }}
      .form-group.sub-rules(@click.stop v-if="reportState.step===1 && reportState.step0 === -1")
        label r/{{ item.data.subreddit }} Rules
        p.text-muted(v-if="!(reportState.rules.length > 0)")
          em r/{{ item.data.subreddit }} has not configured any rule metadata.
        b-form-radio-group(
          v-model="reportState.step1"
        )
          b-form-radio.w-100(
            v-if="reportState.rules.length > 0"
            v-for="(rule, index) in reportState.rules"
            :value="index.short_name"
            :key="`${index}-${rule.violation_reason}`"
          ) {{ rule.violation_reason }}
          b-form-radio.w-100(
            value="other"
          ) Other:
          b-form-input(
            v-model="reportState.other_reason",
            v-disabled="reportState.step1 !== 'other'"
            placeholder="max 100 characters"
          )
          p(
            v-show="reportState.other_reason"
            :class="(reportState.other_reason||'').length > 100 ? 'text-danger' : ''"
          ) {{ (reportState.other_reason||'').length }}/100
      //- .form-group( @todo finish implementing nested site rules
      //-   @click.stop
      //-   v-if="reportState.step===1 && reportState.step0 >= 0 && reportState.site_rules_flow[reportState.step0] && reportState.site_rules_flow[reportState.step0].nextStepHeader"
      //- )
      //-   label Group Radios nextStepHeader
      //-   b-form-radio-group(
      //-     v-model="reportState.step0"
      //-   )
      //-     b-form-radio.w-100(
      //-       v-for="(rule, index) in reportState.rules"
      //-       :value="index.short_name"
      //-     ) {{ rule.violation_reason }}
      //-     b-form-radio.w-100(
      //-       value="other"
      //-     ) Other (@todo form)
      .alert.alert-success(
        v-if="reportState.completeMsg"
        v-text="reportState.completeMsg"
      )
      .alert.alert-danger(
        v-if="reportState.completeErr"
      )
        tt: pre(
          v-text="reportState.completeErr"
        )
      .w-100(slot="modal-footer" @click.stop)
        .btn-group.float-right
          b-button(
            v-if="!reportState.completeMsg"
            size="sm"
            variant="primary"
            @click="showingReportModal=false"
          ) CANCEL
          b-button(
            v-if="reportState.completeMsg"
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
          b-button(
            v-if="showReportModalNext"
            v-disabled="disableReportModalNext"
            size="sm"
            variant="primary"
            @click="reportModalNext"
          ) NEXT
        .report-form-content-policy
           p(@click.stop)
             | Read the <a target="_blank" href="https://www.reddit.com/help/contentpolicy">Reddit Content Policy</a>
             | and <a target="_blank" :href="`/r/${item.data.subreddit}/about/rules`">r/{{ item.data.subreddit }}'s rules</a>.
      </div>

</template>

<script>
import get from 'lodash/get';
import { startMinWait } from '~/lib/sleep';

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
  data() {
    return {
      busy: false,
      error: null,
      showingReportModal: false,
      reportState: init_report_state(),
      additional_info: '',
    };
  },
  computed: {
    classes() {
      return {
        'text-success': this.item.data.hidden === true,
      };
    },
    showReportModalSubmit() {
      const { step, step0, site_rules_flow, completeMsg } = this.reportState;
      if (completeMsg) return false;
      if (step === 0) {
        if (step0 >= 0 && site_rules_flow[step0]) {
          return true;
          // @todo finish implementing nested site-rules
          // return !site_rules_flow[step0].nextStepHeader;
        }
        return false;
      }
      return true;
    },
    showReportModalNext() {
      const { step, step0, completeMsg } = this.reportState;
      if (completeMsg) return false;
      if (this.showReportModalSubmit) return false;
      return true;
    },
    disableReportModalSubmit() {
      const { step, step0 } = this.reportState;
      if (step === 0 && step0 === null) return true;
      return false;
    },
    disableReportModalNext() {
      if (this.showReportModalSubmit) return true;
      const { step, step0 } = this.reportState;
      if (step === 0 && step0 === null) return true;
      return false;
    },
  },
  methods: {
    async reportModalSubmit() {
      console.log('reportModalSubmit');
      const { reportState } = this;
      const { name } = this.item.data;

      const reason = (() => {
        const { step, step0, step1, rules, site_rules_flow } = reportState;
        // subreddit rules
        if (step0 === -1) {
          if (step1 === 'other') {
            return 'other';
          }
          if (rules[step1] && rules[step1].violation_reason) {
            return rules[step1].violation_reason;
          }
        }
        // site rules
        // @todo finish implementing nested subrules
        if (step0 >= 0) {
          if (site_rules_flow[step0] && site_rules_flow[step0].reasonText) {
            return site_rules_flow[step0].reasonText;
          }
        }
        return void 0;
      })();
      const site_reason = (() => {
        const { step, step0, step1, rules, site_rules_flow } = reportState;
        // site rules
        // @todo finish implementing nested subrules
        if (step0 >= 0) {
          if (site_rules_flow[step0] && site_rules_flow[step0].reasonText) {
            return site_rules_flow[step0].reasonText;
          }
        }
        return void 0;
      })();
      const rule_reason = (() => {
        const { step, step0, step1, rules, site_rules_flow } = reportState;
        // subreddit rules
        if (step0 === -1) {
          if (step1 === 'other') {
            return 'other';
          }
          if (rules[step1] && rules[step1].violation_reason) {
            return rules[step1].violation_reason;
          }
        }
        return void 0;
      })();

      const response = await this.$reddit.post('/api/report', {
        api_type: 'json',
        thing_id: name,
        // modmail_conv_id: base36 modmail conversation id
        other_reason: reportState.step1 ? reportState.other_reason : void 0,
        reason: reason, // sub reason
        // rule_reason: rule_reason || void 0,
        site_reason: site_reason || void 0,
      });
      if (get(response.data, 'json.errors.length')) {
        this.reportState.completeMsg =
          'Thank you for your report! (but actually errors)';
        this.reportState.completeErr = response.data.json.errors;
      } else {
        this.reportState.completeMsg = 'Thank you for your report!';
        this.reportState.completeErr = JSON.stringify(
          [['errorssss!!!! (not rly)']],
          null,
          2,
        );
      }
      this.item.reported = true;
    },
    async prompt($event) {
      const { item } = this;
      const { subreddit, name } = this.item.data;
      const responses = {};

      const srRulesResponse = await this.$reddit.get(
        `/r/${subreddit}/about/rules`,
      );

      const { rules, site_rules, site_rules_flow } = srRulesResponse.data;
      Object.assign(this.reportState, { rules, site_rules, site_rules_flow });
      // this.reportState.rules = rules;
      console.log({ rules, site_rules, site_rules_flow });

      this.showingReportModal = true;
    },
    resetReportState() {
      this.reportState = init_report_state();
    },
    reportModalNext() {
      console.log('reportModalNext');
      this.reportState.step++;
    },
  },
};
</script>

<style lang="sass">
.btn-hide
  cursor: pointer
</style>
