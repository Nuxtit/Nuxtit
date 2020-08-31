<template lang="pug">
  .post-poll
    .card
      .card-header Poll Options:
      .card-body
        ul: li(v-for="option in post.data.poll_data.options")
          | {{option.text}}
        table.table.table-sm
          tbody
            tr
              th total_vote_count:
              td {{ post.data.poll_data.total_vote_count }}
            tr(v-if="post.data.poll_data.voting_end_timestamp")
              th voting_end_timestamp:
              td: DateTime(:value="post.data.poll_data.voting_end_timestamp / 1000")
</template>

<script>
import DateTime from '~/components/DateTime';
// no poll API exists at this time
// @link https://old.reddit.com/r/announcements/comments/fo7p5b/introducing_reddit_polls_an_allnew_post_type/fldmuai/
// "poll_data": {
//   "user_selection": null,
//   "voting_end_timestamp": 1599455732351,
//   "options": [
//     {
//       "text": "No restrictions",
//       "id": "2725"
//     },
//     {
//       "text": "They have to be flaired as fake, otherwise they’re fine",
//       "id": "2726"
//     },
//   ],
//   "user_won_amount": null,
//   "is_prediction": false,
//   "resolved_option_id": null,
//   "total_vote_count": 1924,
//   "total_stake_amount": null
// },

export default {
  name: 'PostPoll',
  components: {
    DateTime,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
