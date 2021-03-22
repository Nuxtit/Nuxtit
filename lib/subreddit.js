import includes from 'lodash/includes';

const virtualSubs = ['friends', 'all', 'popular', 'mod'];

export function isImplicitMulti(subreddit) {
  return subreddit && subreddit.includes && subreddit.includes('+');
}

export function isVirtualSubreddit(subreddit) {
  if (includes(virtualSubs, subreddit)) {
    return true;
  }
  return isImplicitMulti(subreddit);
}

export function makeVirtualSubreddit(subreddit) {
  return {
    data: {
      display_name: subreddit,
      // implicitMulti: isImplicitMulti(subreddit),
    },
  };
}
