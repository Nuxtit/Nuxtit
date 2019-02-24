import reject from 'lodash/reject';
import uniq from 'lodash/uniq';
import * as hatesubs from '~/lib/hatesubs';
import * as bots from '~/lib/bots';
import pushshift from '~/lib/pushshift';

export async function applyBadActorScan(items) {
  const usernames = reject(
    uniq(items.map(entry => entry.author)),
    bots.isBot,
  ).filter(username => username !== '[deleted]');
  console.log({
    usernames0: items.map(entry => entry.author),
    usernames1: uniq(items.map(entry => entry.author)),
    usernames2: reject(uniq(items.map(entry => entry.author)), bots.isBot),
    usernames3: usernames,
  });
  if (usernames.length === 0) return [];
  const badActors = {};
  const usernames_csv = usernames.join(',');

  const hatesubComments = await pushshift.get('/reddit/search/comment', {
    params: {
      subreddit: hatesubs.list.join(','),
      fields: 'id,author,subreddit,created_utc,link_id',
      author: usernames_csv,
      size: 500,
    },
  });
  const hatesubSubmissions = await pushshift.get('/reddit/search/submission', {
    params: {
      subreddit: hatesubs.list.join(','),
      fields: 'id,author,subreddit,created_utc,link_id',
      author: usernames_csv,
      size: 500,
    },
  });

  const initBadActor = author => {
    if (!badActors[author]) {
      badActors[author] = {
        comments: {},
        posts: {},
        total: 0,
      };
    }
  };

  hatesubComments.data.data.forEach(({ author, subreddit }) => {
    initBadActor(author);
    if (!badActors[author].comments[subreddit]) {
      badActors[author].comments[subreddit] = 0;
    }
    badActors[author].comments[subreddit]++;
    badActors[author].total++;
  });
  hatesubSubmissions.data.data.forEach(({ author, subreddit }) => {
    initBadActor(author);
    if (!badActors[author].comments[subreddit]) {
      badActors[author].comments[subreddit] = 0;
    }
    badActors[author].comments[subreddit]++;
    badActors[author].total++;
  });

  // const aboutResponse = await axios.get(`https://www.reddit.com/user/${username}/about.json`);

  console.log({ badActors });
}
