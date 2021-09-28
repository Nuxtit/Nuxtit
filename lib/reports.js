export const item_props = [
  'user_reports',
  'user_reports_dismissed',
  'mod_reports',
  'mod_reports_dismissed',
];

export function getData(item) {
  return item_props.reduce((carry, type) => {
    if (item && item && item[type] && item[type].length > 0) {
      carry[type] = item[type];
    }
    return carry;
  }, {});
}

// use item.num_reports
// export function getCount(item) {
//   return item_props.reduce((carry, type) => {
//     if (item && item && item[type] && item[type].length > 0) {
//       return carry + item[type].length;
//     }
//     return carry;
//   });
// }
