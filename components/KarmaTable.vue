<template lang="pug">
  .karma-table
    .row.text-center
      .col(v-if='firstTimestamp')
        span.text-muted from:&#32;
        DateTime(
          :value='firstTimestamp'
        )
      .col
        h5
          | {{ items.data.children.length }} Items
          br
          small.text-muted on this page
      .col(v-if='lastTimestamp')
        span.text-muted until:&#32;
        DateTime(
          v-if='lastTimestamp'
          :value='lastTimestamp'
        )
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
import get from 'lodash/get';
import first from 'lodash/first';
import find from 'lodash/find';
import isInteger from 'lodash/isInteger';
import isNumber from 'lodash/isNumber';
import last from 'lodash/last';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';
import DateTime from '~/components/DateTime.vue';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import SubredditLink from '~/components/SubredditLink';
import { Kind } from '~/lib/enum';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  name: 'KarmaTable',
  components: {
    bFormTextarea,
    CommentEntry,
    DateTime,
    PostEntry,
    SubredditLink,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    items: {
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
    rows() {
      return this.items.data.children.reduce((carry, { kind, data }) => {
        if (!carry[data.subreddit]) {
          carry[data.subreddit] = {
            pc: 0,
            pk: 0,
            cc: 0,
            ck: 0,
            oc: 0,
          };
        }
        if (isInteger(data.score)) {
          if (kind === Kind.Post) {
            carry[data.subreddit].pk += data.score;
            carry[data.subreddit].pc++;
          } else if (kind === Kind.Comment) {
            carry[data.subreddit].ck += data.score;
            carry[data.subreddit].cc++;
          } else {
            carry[data.subreddit].oc++;
          }
        }
        return carry;
      }, {});
    },
    rowsMarkdown() {
      const {
        rows,
        user,
        firstTimestamp,
        lastTimestamp,
        dateNumToString,
      } = this;
      const columnAlignments = ':--|--:|--:|--:|--:|--:|--:\n';
      let text = '';
      if (user) {
        /*eslint-disable*/
        text += `##### /u/${
          user.data.name
        } Karma Summary from ${
          dateNumToString(firstTimestamp)
        } until ${
          dateNumToString(lastTimestamp)
        } \n`;
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
    firstTimestamp() {
      const { sort } = this.$route.params;
      if (sort && sort !== 'new') return;
      const item =
        find(this.items.data.children, item => {
          if (item.data) {
            if (item.data.pinned) return false;
            if (item.data.stickied) return false;
          }
          return true;
        }) || last(this.items.data.children);
      return get(item.data, 'created_utc');
    },
    lastTimestamp() {
      const { sort } = this.$route.params;
      if (sort && sort !== 'new') return;
      const item = last(this.items.data.children);
      return get(item.data, 'created_utc');
    },
  },
  methods: {
    toDate(value) {
      if (value instanceof Date) {
        return value;
      }
      if (isNumber(value)) {
        return new Date(value * 1000);
      }
      return new Date(value);
    },
    dateNumToString(value) {
      return this.toDate(value).toLocaleString();
    },
  },
};
</script>

<style lang="sass">
.karma-table table.table
  width: unset;
</style>
