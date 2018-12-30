// returns a new object but with all keys in order
export function sortObject(o) {
  // eslint-disable-next-line
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}
