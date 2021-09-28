import get from 'lodash/get';

export default {
  computed: {
    commentsCount() {
      console.log('commentsCount', get(this.comments, 'children.length', 0));
      return get(this.comments, 'children.length', 0);
    },
    zeroComments() {
      console.log('zeroComments', 'this.commentsCount', this.commentsCount);
      return !(this.commentsCount > 0);
    },
    hasComments() {
      console.log('hasComments', 'this.commentsCount', this.commentsCount);
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
