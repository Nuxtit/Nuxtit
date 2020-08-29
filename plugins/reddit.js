import Vue from 'vue';
import sleep from '~/lib/sleep';
import axios from 'axios';
import get from 'lodash/get';
import isString from 'lodash/isString';
import qs from 'qs';
import axiosRetry from 'axios-retry';

const redditClientId = process.env.redditClientId;
const redirect_uri = process.env.redditRedirectUri;

// @link https://www.reddit.com/dev/api/
const OAUTH_BASE = 'https://oauth.reddit.com/';
const API_BASE = 'https://api.reddit.com/';
const X_RATELIMIT_REMAINING = 'x-ratelimit-remaining';
const CONTENT_TYPE = 'Content-Type';

let lastResponseHeaders;

export default function(ctx) {
  ctx.reddit = axios.create({
    baseURL: OAUTH_BASE,
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

  axiosRetry(ctx.reddit, {
    retries: 9,
    retryDelay: axiosRetry.exponentialDelay,
  });

  Vue.prototype.$reddit = ctx.reddit;

  ctx.reddit.interceptors.request.use(async config => {
    const accessToken = await getAccessToken(ctx, {
      username: config.username || ctx.store.getters['auth/username'],
    });
    if (!accessToken) {
      console.error(ctx.store.state, { accessToken, config });
      throw new AccessTokenRequiredError();
    }
    if (!config.params) {
      config.params = {};
    }
    config.params.raw_json = 1;
    config.headers.Authorization = `bearer ${accessToken}`;
    if (lastResponseHeaders) {
      if (!(lastResponseHeaders[X_RATELIMIT_REMAINING] > 10)) {
        console.warn(
          'Sleeping for 5 seconds to avoid ratelimit',
          lastResponseHeaders[X_RATELIMIT_REMAINING],
        );
        await sleep(5000);
      }
    }

    config.apiLog = {
      start: now(),
      username: ctx.store.getters['auth/username'],
    };
    return config;
  });

  ctx.reddit.interceptors.response.use(
    async response => {
      ctx.store.dispatch('apilog/add', response);

      /* no await */ ctx.store.dispatch(
        'masstagger/fetchTags',
        response && response.data,
      );

      lastResponseHeaders = response.headers;
      return response;
    },
    async err => {
      ctx.store.dispatch('apilog/add', err.response || err);
      console.error('intercepter.err', err);
      throw err;
    },
  );
}

export function AccessTokenRequiredError() {
  this.message = 'Access Token Required';
}
AccessTokenRequiredError.prototype = new Error();

const scopes = [
  // 'account',
  // 'creddits',
  'edit',
  'flair',
  'history',
  'identity',
  // 'livemanage',
  'modconfig',
  'modcontributors',
  'modflair',
  'modlog',
  'modmail',
  'modothers',
  'modposts',
  'modself',
  'modtraffic',
  'modwiki',
  'mysubreddits',
  'privatemessages',
  'read',
  'report',
  'save',
  'structuredstyles',
  'submit',
  'subscribe',
  'vote',
  'wikiedit',
  'wikiread',
];

// {
//     "creddits": {
//         "description": "Spend my reddit gold creddits on giving gold to other users.",
//         "id": "creddits",
//         "name": "Spend reddit gold creddits"
//     },
//     "modcontributors": {
//         "description": "Add/remove users to approved user lists and ban/unban or mute/unmute users from subreddits I moderate.",
//         "id": "modcontributors",
//         "name": "Approve and ban users"
//     },
//     "modmail": {
//         "description": "Access and manage modmail via mod.reddit.com.",
//         "id": "modmail",
//         "name": "New Modmail"
//     },
//     "modconfig": {
//         "description": "Manage the configuration, sidebar, and CSS of subreddits I moderate.",
//         "id": "modconfig",
//         "name": "Moderate Subreddit Configuration"
//     },
//     "subscribe": {
//         "description": "Manage my subreddit subscriptions. Manage \"friends\" - users whose content I follow.",
//         "id": "subscribe",
//         "name": "Edit My Subscriptions"
//     },
//     "structuredstyles": {
//         "description": "Edit structured styles for a subreddit I moderate.",
//         "id": "structuredstyles",
//         "name": "Edit structured styles"
//     },
//     "vote": {
//         "description": "Submit and change my votes on comments and submissions.",
//         "id": "vote",
//         "name": "Vote"
//     },
//     "wikiedit": {
//         "description": "Edit wiki pages on my behalf",
//         "id": "wiki",
//         "name": "Wiki Editing"
//     },
//     "mysubreddits": {
//         "description": "Access the list of subreddits I moderate, contribute to, and subscribe to.",
//         "id": "mysubreddits",
//         "name": "My Subreddits"
//     },
//     "submit": {
//         "description": "Submit links and comments from my account.",
//         "id": "submit",
//         "name": "Submit Content"
//     },
//     "modlog": {
//         "description": "Access the moderation log in subreddits I moderate.",
//         "id": "modlog",
//         "name": "Moderation Log"
//     },
//     "modposts": {
//         "description": "Approve, remove, mark nsfw, and distinguish content in subreddits I moderate.",
//         "id": "modposts",
//         "name": "Moderate Posts"
//     },
//     "modflair": {
//         "description": "Manage and assign flair in subreddits I moderate.",
//         "id": "modflair",
//         "name": "Moderate Flair"
//     },
//     "save": {
//         "description": "Save and unsave comments and submissions.",
//         "id": "save",
//         "name": "Save Content"
//     },
//     "modothers": {
//         "description": "Invite or remove other moderators from subreddits I moderate.",
//         "id": "modothers",
//         "name": "Invite or remove other moderators"
//     },
//     "read": {
//         "description": "Access posts and comments through my account.",
//         "id": "read",
//         "name": "Read Content"
//     },
//     "privatemessages": {
//         "description": "Access my inbox and send private messages to other users.",
//         "id": "privatemessages",
//         "name": "Private Messages"
//     },
//     "report": {
//         "description": "Report content for rules violations. Hide \u0026 show individual submissions.",
//         "id": "report",
//         "name": "Report content"
//     },
//     "identity": {
//         "description": "Access my reddit username and signup date.",
//         "id": "identity",
//         "name": "My Identity"
//     },
//     "livemanage": {
//         "description": "Manage settings and contributors of live threads I contribute to.",
//         "id": "livemanage",
//         "name": "Manage live threads"
//     },
//     "account": {
//         "description": "Update preferences and related account information. Will not have access to your email or password.",
//         "id": "account",
//         "name": "Update account information"
//     },
//     "modtraffic": {
//         "description": "Access traffic stats in subreddits I moderate.",
//         "id": "modtraffic",
//         "name": "Subreddit Traffic"
//     },
//     "wikiread": {
//         "description": "Read wiki pages through my account",
//         "id": "wikiread",
//         "name": "Read Wiki Pages"
//     },
//     "edit": {
//         "description": "Edit and delete my comments and submissions.",
//         "id": "edit",
//         "name": "Edit Posts"
//     },
//     "modwiki": {
//         "description": "Change editors and visibility of wiki pages in subreddits I moderate.",
//         "id": "modwiki",
//         "name": "Moderate Wiki"
//     },
//     "modself": {
//         "description": "Accept invitations to moderate a subreddit. Remove myself as a moderator or contributor of subreddits I moderate or contribute to.",
//         "id": "modself",
//         "name": "Make changes to your subreddit moderator and contributor status"
//     },
//     "history": {
//         "description": "Access my voting history and comments or submissions I've saved or hidden.",
//         "id": "history",
//         "name": "History"
//     },
//     "flair": {
//         "description": "Select my subreddit flair. Change link flair on my submissions.",
//         "id": "flair",
//         "name": "Manage My Flair"
//     }
// }

export async function fetchAccessToken({ state, code, error }) {
  return axios.post(
    `${API_BASE}api/v1/access_token`,
    [
      'grant_type=authorization_code',
      `code=${code}`,
      `redirect_uri=${redirect_uri}`,
    ].join('&'),
    {
      auth: {
        username: process.env.redditClientId,
        password: process.env.redditClientSecret,
      },
    },
  );
}

export async function fetchRefreshedAccessToken({ refresh_token }) {
  return axios.post(
    `${API_BASE}api/v1/access_token`,
    ['grant_type=refresh_token', `refresh_token=${refresh_token}`].join('&'),
    {
      auth: {
        username: process.env.redditClientId,
        password: process.env.redditClientSecret,
      },
    },
  );
}

function randomState() {
  // eslint-disable-next-line
  return Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2);
}

export function getOAuthLoginHref() {
  const state = randomState();
  return (
    'https://www.reddit.com/api/v1/authorize?' +
    'client_id=' +
    process.env.redditClientId +
    '&response_type=code' +
    '&state=' +
    state +
    '&redirect_uri=' +
    redirect_uri +
    '&duration=permanent' +
    '&scope=' +
    scopes.join('+')
  );
}

async function isAccessTokenExpired(ctx, { username }) {
  // console.assert(username);
  const expiresAt = username
    ? get(ctx.store.state, `auth.Accounts.${username}.OAuthData.expires_at`, 0)
    : get(ctx.store.state, `auth.tmpOAuthData.expires_at`, 0);
  const isExpired = expiresAt >= Date.now() + 500;
  // console.log('isAccessTokenExpired', { isExpired, expiresAt });
  return expiresAt >= Date.now() + 500;
}

async function getAccessToken(ctx, { username }) {
  // console.assert(username);
  // console.log('getAccessToken');
  if (isAccessTokenExpired(ctx, { username })) {
    await ctx.store.dispatch('auth/fetchRefreshedAccessToken', { username });
  }
  if (!username && get(ctx.store.state, 'auth.tmpOAuthData')) {
    return ctx.store.state.auth.tmpOAuthData.access_token;
  }
  return get(
    ctx.store.state,
    `auth.Accounts.${username}.OAuthData.access_token`,
  );
}

function now() {
  return Date.now() / 1000;
}
