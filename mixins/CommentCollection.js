import get from 'lodash/get';

export default {
  computed: {
    commentsCount() {
      return get(this.comments, 'children.length', 0);
    },
    zeroComments() {
      return !(this.commentsCount > 0);
    },
    hasComments() {
      return this.commentsCount > 0;
    },
  },
};
