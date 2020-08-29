<template lang="pug">
div
  SubredditLink(v-if="conversation.owner.type==='subreddit'" :subreddit="conversation.owner.displayName")
  UserLink(v-else-if="conversation.owner.displayName" :username="conversation.owner.displayName")
  p
    | id:
    | {{ conversation.id }}
  p
    | subject:
    | {{ conversation.subject }}
  p
    | lastModUpdated:
    | {{ conversation.lastModUpdated }}
  p
    | lastUpdated:
    | {{ conversation.lastUpdated }}
  p
    | participant:
    | {{ conversation.participant }}
  p
    | state:
    | {{ conversation.state }}
  p
    | numMessages:
    | {{ conversation.numMessages }}
</template>

<script>
import SubredditLink from '~/components/SubredditLink';
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';

export default {
  name: 'Conversation',
  components: {
    SubredditLink,
    TimeAgo,
    UserLink,
  },
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
  computed: {},
};
</script>
