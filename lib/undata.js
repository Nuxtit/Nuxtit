import isArray from 'lodash/isArray';
import get from 'lodash/get';
import map from 'lodash/map';

// this function is intended to rewrite API objects
// to be flatter, remove useless nesting of { data: {} },
// and drop unused properties
export default function undata(data) {
  // console.log('undata', data && data.kind, { data });
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

    if (data.data.replies === '') delete data.data.replies;
    if (data.data.replies && data.data.replies.kind === 'Listing') {
      // data.data.replies.kind = data.data.replies.kind;
      // data.data.replies = data.data.replies;
      // data.data.replies.children = map(data.data.replies.children, undata);
      data.data.replies = undata(data.data.replies);
    }

    if (data.data.children && isArray(data.data.children)) {
      data.data.children = map(data.data.children, undata);
    }

    // console.info(`undata:result[${data.kind}]`, { data: data.data });
    return data.data;
  }
  console.warn('unhandled undata kind: ' + data.kind, data);
  return data;
}

export function unchildren(value) {
  return (value && value.data && value.data.children) || null;
}
