<template lang="pug">
  .messages-list
    MessageEntry(
      v-for='message in messages.data.children'
      :message='message'
      :key='message.data.id'
    )
</template>

<script>
import MessageEntry from '~/components/MessageEntry';

export default {
  name: 'MessageList',
  components: {
    MessageEntry,
  },
  props: {
    messages: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
