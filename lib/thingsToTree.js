import find from 'lodash/find';

export default function(things, parent_id) {
  // console.log('parent_id', parent_id);
  const allChildren = things || [];
  const rootChildren = allChildren.filter(i => i.data.parent_id === parent_id);
  const otherChildren = allChildren.filter(i => i.data.parent_id !== parent_id);
  otherChildren.forEach(c1 => {
    const c2 = find(allChildren, c2 => c2.data.name === c1.data.parent_id);
    if (c2) {
      if (c2.data.replies) {
        c2.data.replies.data.children.push(c1);
      } else {
        c2.data.replies = {
          data: {
            children: [c1],
          },
        };
      }
    }
  });
  return rootChildren;
}
