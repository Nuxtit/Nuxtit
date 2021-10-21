import get from 'lodash/get';

export default {
  computed: {
    messagesCount() {
      return get(this.messages, 'children.length', 0);
    },
    zeroComments() {
      return !(this.messagesCount > 0);
    },
    hasComments() {
      return this.messagesCount > 0;
    },
  },
};
