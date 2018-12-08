<template lang="pug">
  .karma-table
    table.table-sm
      thead
        tr
          th Subreddit
          th Comments
          th (Karma)
          th Posts
          th (Karma)
          th Other
      tbody
        tr(
          v-for='(row, subreddit) in rows'
        )
          td {{ subreddit }}
          td {{ row.cc }}
          td {{ row.ck }}
          td {{ row.pc }}
          td {{ row.pk }}
          //- td {{ row.oc }}
</template>

<script>
import isInteger from 'lodash/isInteger';
import CommentEntry from '~/components/CommentEntry';
import PostEntry from '~/components/PostEntry';
import { Kind } from '~/lib/enum';
export default {
  name: 'KarmaTable',
  components: {
    CommentEntry,
    PostEntry,
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
            carry[data.subreddit].pc;
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
  },
};
</script>

<style lang="sass">
</style>
