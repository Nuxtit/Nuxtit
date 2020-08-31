<template lang="pug">
  div
    SelectRedditModMailState
    h2 Mod Mail
    Conversation(
      v-for="conversation in conversations"
      :conversation="conversation"
      :messages="messagesFor(conversation)"
      :key="conversation.id")
</template>

<script>
import SelectRedditModMailState from '~/components/SelectRedditModMailState';
import Conversation from '~/components/Mod/Mail/Conversation';

export default {
  components: {
    SelectRedditModMailState,
    Conversation,
  },
  watchQuery: true,
  // data() {
  //   return {
  //   };
  // },
  async asyncData({ route, reddit }) {
    const res = await reddit.get('/api/mod/conversations', {
      params: {
        state: route.query.state || 'default',
      },
    });
    console.log(res);
    return {
      // conversations, messages, viewerId, conversationIds
      ...res.data,
    };
  },
  // computed: {
  // },
  methods: {
    messagesFor(conversation) {
      const message_id_list = conversation.objIds
        .filter(o => o.key === 'messages')
        .map(o => o.id);
      const result = {};
      for (const id in this.messages) {
        if (message_id_list.includes(id)) {
          result[id] = this.messages[id];
        }
      }
      return result;
    },
  },
};
</script>
