<template lang="pug">
  .about-user
    p link_karma: {{ user.link_karma }}
    p comment_karma: {{ user.comment_karma }}
    p has_verified_email: {{ user.has_verified_email }}
    p is_employee: {{ user.is_employee }}
    p is_friend: {{ user.is_friend }}
    p is_gold: {{ user.is_gold }}
    p verified: {{ user.verified }}
    .user-subreddit(v-if="user.subreddit")
      p subreddit.over_18: {{ user.subreddit.over_18 }}
      p subreddit.subreddit_type: {{ user.subreddit.subreddit_type }}
      p subreddit.public_description: {{ user.subreddit.public_description }}
      p subreddit.subscribers: {{ user.subreddit.subscribers }}
      p subreddit.title: {{ user.subreddit.title }}
      p subreddit.url: {{ user.subreddit.url }}
      p subreddit.show_media: {{ user.subreddit.show_media }}
      p subreddit.user_is_banned: {{ user.subreddit.user_is_banned }}
      p subreddit.user_is_contributor: {{ user.subreddit.user_is_contributor }}
      p subreddit.user_is_moderator: {{ user.subreddit.user_is_moderator }}
      p subreddit.user_is_muted: {{ user.subreddit.user_is_muted }}
      p subreddit.user_is_subscriber: {{ user.subreddit.user_is_subscriber }}
    TimeAgo(:value='user.created_utc')
</template>

<script>
import TimeAgo from '~/components/TimeAgo';

export default {
  middleware: ['auth'],
  components: {
    TimeAgo,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
