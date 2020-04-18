export const item_props = [
  'user_reports',
  'user_reports_dismissed',
  'mod_reports',
  'mod_reports_dismissed',
];

export function getData(item) {
  return item_props.reduce((carry, type) => {
    if (item && item.data && item.data[type] && item.data[type].length > 0) {
      carry[type] = item.data[type];
    }
    return carry;
  }, {});
}

// use item.data.num_reports
// export function getCount(item) {
//   return item_props.reduce((carry, type) => {
//     if (item && item.data && item.data[type] && item.data[type].length > 0) {
//       return carry + item.data[type].length;
//     }
//     return carry;
//   });
// }
