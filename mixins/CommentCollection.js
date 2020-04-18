import get from 'lodash/get';

export default {
  computed: {
    commentsCount() {
      return get(this.comments, 'data.children.length', 0);
    },
    zeroComments() {
      return !(this.commentsCount > 0);
    },
    hasComments() {
      return this.commentsCount > 0;
    },
  },
};

/*
import get from 'lodash/get';

$: commentsCount = get(comments, 'data.children.length', 0);
$: zeroComments = !(commentsCount > 0);
$: hasComments = commentsCount > 0;
*/
