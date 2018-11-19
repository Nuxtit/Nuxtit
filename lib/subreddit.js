import includes from 'lodash/includes';

const virtualSubs = ['friends', 'all', 'popular'];

export function isVirtualSubreddit(subreddit) {
  return includes(virtualSubs, subreddit);
}

export function makeVirtualSubreddit(subreddit) {
  return {
    data: {
      display_name: subreddit,
    },
  };
}
