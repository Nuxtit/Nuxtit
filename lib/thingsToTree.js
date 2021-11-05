import find from 'lodash/find';
import map from 'lodash/map';
import undata from '~/lib/undata';

export default function(things, parent_id) {
  // console.log('parent_id', parent_id);
  const allChildren = map(things, undata);
  const rootChildren = allChildren.filter(i => i.parent_id === parent_id);
  const otherChildren = allChildren.filter(i => i.parent_id !== parent_id);
  otherChildren.forEach(c1 => {
    const c2 = find(allChildren, c2 => c2.name === c1.parent_id);
    if (c2) {
      if (c2.replies) {
        c2.replies.children.push(c1);
      } else {
        c2.replies = {
          children: [c1],
        };
      }
    }
  });
  return rootChildren;
}
