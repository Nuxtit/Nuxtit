<template lang="pug">
  .about-user
    p link_karma: {{ user.data.link_karma }}
    p comment_karma: {{ user.data.comment_karma }}
    p has_verified_email: {{ user.data.has_verified_email }}
    p is_employee: {{ user.data.is_employee }}
    p is_friend: {{ user.data.is_friend }}
    p is_gold: {{ user.data.is_gold }}
    p verified: {{ user.data.verified }}
    .user-subreddit(v-if="user.data.subreddit")
      p subreddit.over_18: {{ user.data.subreddit.over_18 }}
      p subreddit.subreddit_type: {{ user.data.subreddit.subreddit_type }}
      p subreddit.public_description: {{ user.data.subreddit.public_description }}
      p subreddit.subscribers: {{ user.data.subreddit.subscribers }}
      p subreddit.title: {{ user.data.subreddit.title }}
      p subreddit.url: {{ user.data.subreddit.url }}
      p subreddit.show_media: {{ user.data.subreddit.show_media }}
      p subreddit.user_is_banned: {{ user.data.subreddit.user_is_banned }}
      p subreddit.user_is_contributor: {{ user.data.subreddit.user_is_contributor }}
      p subreddit.user_is_moderator: {{ user.data.subreddit.user_is_moderator }}
      p subreddit.user_is_muted: {{ user.data.subreddit.user_is_muted }}
      p subreddit.user_is_subscriber: {{ user.data.subreddit.user_is_subscriber }}
    TimeAgo(:value='user.data.created_utc')
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
