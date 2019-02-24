import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import uniq from 'lodash/uniq';
import { Kind } from '~/lib/enum';

export const defaultKind = Kind.Comment;

export default {
  computed: {
    kinds: {
      get() {
        return parseKinds(this.$route.query.kinds);
      },
      set(value) {
        console.log({ value, formatted: formatKinds(value) });
        this.$router.push(
          this.$mergeRouteQuery({
            kinds: formatKinds(value),
          }),
        );
      },
    },
  },
};

const queryToEnum = {
  submission: 'Post',
  post: 'Post',
  comment: 'Comment',
  subreddit: 'Subreddit',
};

export function formatKinds(value) {
  if (isArray(value)) {
    value = value.map(v => enumToQuery[v] || v).filter(Boolean);
    value = uniq(value);
    value = value.join(',');
  }
  if (isString(value)) {
    return value;
  }
  return null;
}

export function parseKinds(value) {
  if (isString(value)) {
    value = value.split(',');
  }
  if (isArray(value)) {
    return value.filter(Boolean);
  }
  return [];
}
export function parseKind(value) {
  // console.log({
  //   value,
  //   a1: queryToEnum[value],
  //   a2: Kind[queryToEnum[value]],
  //   b: Kind[value],
  //   c: Object.values(Kind).filter(kindId => kindId === value)[0],
  // });
  if (queryToEnum[value]) {
    return Kind[queryToEnum[value]];
  }
  if (Kind[value]) {
    return Kind[value];
  }
  return (
    Object.values(Kind).filter(kindId => kindId === value)[0] || defaultKind
  );
}

const enumToQuery = {
  [Kind.Comment]: 'comment',
  [Kind.Post]: 'post',
  [Kind.Subreddit]: 'subreddit',
};
