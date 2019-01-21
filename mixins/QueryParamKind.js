import { Kind } from '~/lib/enum';

export const defaultKind = Kind.Comment;

export default {
  computed: {
    kind: {
      get() {
        return parseKind(this.$route.query.kind);
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            kind: enumToQuery[value] || value,
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
