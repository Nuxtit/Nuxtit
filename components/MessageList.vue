<template lang="pug">
  .messages-list
    MessageEntry(
      v-for='message in dataChildren'
      :message='message'
      :key='message.data.id'
    )
</template>

<script>
import get from 'lodash/get';
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
  computed: {
    dataChildren() {
      return get(this, 'messages.data.children') || [];
    },
  },
};
</script>

<style></style>
