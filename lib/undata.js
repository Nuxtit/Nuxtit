import get from 'lodash/get';
import map from 'lodash/map';

export default function undata (data) {
  if (data === null) return null;
  if (data.kind && data.data) {
    data.data.kind = data.data.kind || data.kind;

    data = data.data;

    // not yet implemented, takes up space
    delete data.all_awardings;
    // "This attribute is deprecated. Please use mod_reports and user_reports instead."
    delete data.report_reasons;

    if (data.replies && data.replies.kind === 'Listing') {
      data.replies = map(unchildren(data.replies), undata);
    }

    return data;
  }
  // console.warn('unhandled undata kind: '+data.kind, data);
  return data;
}

export function unchildren(value) {
  return (value && value.data && value.data.children) || null;
}
