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
import isInteger from 'lodash/isInteger';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';
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
    PostEntry,
    SubredditLink,
  },
  props: {
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
      const columnAlignments = ':--|--:|--:|--:|--:|--:|--:\n';
      let text = '';
      text += 'Subreddit|Comments|(Karma)|(avg)|Posts|(Karma)|(avg)\n';
      text += columnAlignments;
      let row;
      for (let subreddit in this.rows) {
        row = this.rows[subreddit];
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
};
</script>

<style lang="sass">
.karma-table table.table
  width: unset;
</style>
