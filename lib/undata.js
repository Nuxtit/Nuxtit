import get from 'lodash/get';
import map from 'lodash/map';

export default function undata(data) {
  if (data === null) return null;
  if (data.kind && data.data) {
    data.data.kind = data.data.kind || data.kind;

    // data = data.data;

    // "This attribute is deprecated. Please use mod_reports and user_reports instead."
    delete data.data.report_reasons;
    // not used, save memory
    delete data.data.is_robot_indexable;
    delete data.data.subreddit_id; // t5_someid
    delete data.data.author_fullname; // t2_someid
    delete data.data.wls; // basically unknown
    delete data.data.pwls; // basically unknown
    delete data.data.subreddit_name_prefixed; // never used

    if (data.replies && data.replies.kind === 'Listing') {
      data.replies = map(data.replies, undata);
      // data.replies = map(unchildren(data.replies), undata);
    }

    return data;
  }
  // console.warn('unhandled undata kind: '+data.kind, data);
  return data;
}

export function unchildren(value) {
  return (value && value.data && value.data.children) || null;
}
