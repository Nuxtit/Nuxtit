const argv = require('argv');
const axios = require('axios');
const qs = require('qs');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const isString = require('lodash/isString');
const isInteger = require('lodash/isInteger');
const map = require('lodash/map');

const OAUTH_BASE = 'https://oauth.reddit.com/';
const API_BASE = 'https://api.reddit.com/';
const X_RATELIMIT_REMAINING = 'x-ratelimit-remaining';
const CONTENT_TYPE = 'Content-Type';

const Kind = {
  Comment: 't1',
  User: 't2',
  Post: 't3',
  Message: 't4',
  Subreddit: 't5',
};

argv.option({
  name: 'subreddit',
  short: 's',
  type: 'string',
  description: 'subreddit or + seperated subreddit list',
  example: "'script --subreddit=funny' or 'script -s funny+pics'",
});

argv.option({
  name: 'min-karma',
  // short: 's',
  type: 'int',
  description:
    'the sum of all comments/posts by a user in the subreddits must add up to this value',
  example: "'script --subreddit=stallmanwasright --min-karma=100'",
});

argv.option({
  name: 'min-comment-karma',
  // short: 's',
  type: 'int',
  description:
    'the sum of all comment karma by a user in the subreddits must add up to this value',
  example: "'script --subreddit=stallmanwasright --min-comment-karma=100'",
});

argv.option({
  name: 'min-comment-count',
  // short: 's',
  type: 'int',
  description:
    'the count of all comments by a user in the subreddits must add up to this value',
  example: "'script --subreddit=stallmanwasright --min-comment-count=100'",
});

argv.option({
  name: 'min-post-karma',
  // short: 's',
  type: 'int',
  description:
    'the sum of all post karma by a user in the subreddits must add up to this value',
  example: "'script --subreddit=stallmanwasright --min-post-karma=100'",
});

argv.option({
  name: 'min-post-count',
  // short: 's',
  type: 'int',
  description:
    'the count of all posts by a user in the subreddits must add up to this value',
  example: "'script --subreddit=stallmanwasright --min-post-count=100'",
});

const args = argv.run();

if (!args.options.subreddit) {
  console.error('Error: subreddit required');
  argv.help();
  process.exit(1);
}

const reddit = axios.create({
  baseURL: 'https://www.reddit.com',
  headers: {
    // 'User-Agent': 'axios-reddit-client/v0.0.0',
    [CONTENT_TYPE]: 'application/x-www-form-urlencoded',
  },
  responseType: 'json',
  maxRedirects: 0,
  transformRequest(data, headers) {
    if (isString(data) && data[0] === '{') {
      headers[CONTENT_TYPE] = 'application/json';
      return data;
    }
    return qs.stringify(data, { arrayFormat: 'brackets' });
  },
});

reddit.interceptors.request.use(config => {
  console.log(config.method, config.url);
  return config;
});

(async () => {
  let after = null;
  let before = null;
  let itemsCount;
  const limit = 100;
  const stats = { users: {} };

  do {
    const url = `/r/${args.options.subreddit}.json`;
    const response = await reddit.get(url, {
      params: {
        limit,
        after,
      },
    });

    appendRedditStats(stats, response.data);
  } while (itemsCount >= limit && after);

  // before = null;
  // after = null;

  do {
    const url = `/r/${args.options.subreddit}/comments.json`;
    const response = await reddit.get(url, {
      params: {
        limit,
        after,
      },
    });

    appendRedditStats(stats, response.data);
  } while (itemsCount >= limit && after);

  function appendRedditStats(stats, data) {
    // console.log(data.data.children.length);
    // itemsCount = 0;
    itemsCount = get(data.data.children, 'length');
    before = data.data.before;
    after = data.data.after;
    forEach(data.data.children, ({ kind, data }) => {
      if (kind === Kind.Comment) {
        const { subreddit, author, score } = data;
        // console.log('comment', { subreddit, author, score });
        if (!stats.users[author]) {
          stats.users[author] = blank_user_stat(author);
        }
        stats.users[author].commentCount += 1;
        stats.users[author].commentKarma += score;
      } else if (kind === Kind.Post) {
        const { subreddit, author, score } = data;
        // console.log('post', { subreddit, author, score });
        if (!stats.users[author]) {
          stats.users[author] = blank_user_stat(author);
        }
        stats.users[author].postCount += 1;
        stats.users[author].postKarma += score;
      }
      // process.exit(0);
    });
  }

  for (let username in stats.users) {
    if (shouldBeFiltered(stats.users[username])) {
      delete stats.users[username];
    }
  }

  // console.log(stats.users);
  // console.log({ before, after, itemsCount });

  // pretty table for cli users
  console.table(Object.values(stats.users));

  // list for copying to automoderator yml
  // eslint-disable-next-line
  console.log('[ ', Object.keys(stats.users).map(username => `'${username}'`).join(', '),' ]');
})().catch(err => {
  console.error(err);
  process.exit(1);
});

function to_data(i) {
  return i && i.data;
}

function blank_user_stat(author) {
  return {
    author,
    postKarma: 0,
    postCount: 0,
    commentKarma: 0,
    commentCount: 0,
  };
}

function shouldBeFiltered(stat) {
  if (isInteger(args.options['min-comment-karma'])) {
    if (args.options['min-comment-karma'] >= stat.commentKarma) {
      return true;
    }
  }
  if (isInteger(args.options['min-comment-count'])) {
    if (args.options['min-comment-count'] >= stat.commentCount) {
      return true;
    }
  }
  if (isInteger(args.options['min-post-karma'])) {
    if (args.options['min-post-karma'] >= stat.postKarma) {
      return true;
    }
  }
  if (isInteger(args.options['min-post-count'])) {
    if (args.options['min-post-count'] >= stat.postCount) {
      return true;
    }
  }
  if (isInteger(args.options['min-karma'])) {
    const combinedKarma =
      args.options['min-post-karma'] + args.options['min-comment-karma'];
    if (args.options['min-karma'] >= combinedKarma) {
      return true;
    }
  }
  return false;
}
