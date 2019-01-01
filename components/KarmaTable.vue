<template lang="pug">
  .karma-table
    p
      span.btn-see-markdown(
        @click.prevent.stop='showMarkdown^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span see markdown
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        span see source
    .table-responsive(v-if='open===null'): table.table.table-sm
      thead
        tr
          th Subreddit
          th.text-right Comments
          th.text-right (Karma)
          th.text-right (avg)
          th.text-right Posts
          th.text-right (Karma)
          th.text-right (avg)
          //- th Other
      tbody
        tr(
          v-for='(row, subreddit) in rows'
        )
          td: SubredditLink(:subreddit='subreddit')
          td.text-right {{ row.cc }}
          td.text-right {{ row.ck }}
          td.text-right(v-if='row.cc > 0' v-text='(row.ck / row.cc).toFixed(1)')
          td.text-right.text-muted(v-else) na
          td.text-right {{ row.pc }}
          td.text-right {{ row.pk }}
          td.text-right(v-if='row.pc > 0' v-text='(row.pk / row.pc).toFixed(1)')
          td.text-right.text-muted(v-else) na
          //- td {{ row.oc }}
    pre(v-if="showSource")
      tt: small(v-text="rows")
    b-form-textarea.comment-body(
      v-if="showMarkdown"
      v-model="rowsMarkdown"
      :rows="3"
    )
</template>

<script>
import isNumber from 'lodash/isNumber';
import last from 'lodash/last';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';
import DateTime from '~/components/DateTime.vue';
import SubredditLink from '~/components/SubredditLink';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'KarmaTable',
  components: {
    bFormTextarea,
    DateTime,
    SubredditLink,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    rows: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: null,
    };
  },
  computed: {
    showMarkdown: makeComputeToggler('markdown'),
    showSource: makeComputeToggler('source'),
    rowsMarkdown() {
      const { rows, user } = this;
      const columnAlignments = ':--|--:|--:|--:|--:|--:|--:\n';
      let text = '';
      if (user) {
        /*eslint-disable*/
        text += `##### /u/${
          user.data.name
        } Karma Summary \n`;
        /*eslint-enable*/
      }
      text += 'Subreddit|Comments|(Karma)|(avg)|Posts|(Karma)|(avg)\n';
      text += columnAlignments;
      let row;
      for (let subreddit in rows) {
        row = rows[subreddit];
        text +=
          [
            subreddit.startsWith('u_')
              ? `/u/${subreddit.replace('u_', '')}`
              : `/r/${subreddit}`,
            row.cc,
            row.ck.toFixed(1),
            row.cc > 0 ? (row.ck / row.cc).toFixed(1) : '_na_',
            row.pc,
            row.pk.toFixed(1),
            row.pc > 0 ? (row.pk / row.pc).toFixed(1) : '_na_',
          ].join('|') + '\n';
      }
      return text;
    },
  },
  methods: {
    // toDate(value) {
    //   if (value instanceof Date) {
    //     return value;
    //   }
    //   if (isNumber(value)) {
    //     return new Date(value * 1000);
    //   }
    //   return new Date(value);
    // },
    // dateNumToString(value) {
    //   return this.toDate(value).toLocaleString();
    // },
  },
};
</script>

<style lang="sass">
.karma-table table.table
  width: unset;
</style>
