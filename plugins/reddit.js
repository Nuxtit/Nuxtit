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
    const accessToken = await getAccessToken(ctx);
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
  'identity',
  'edit',
  'flair',
  'history',
  'modcontributors',
  'modconfig',
  // 'modflair',
  'modlog',
  'modposts',
  // 'modwiki',
  'mysubreddits',
  'privatemessages',
  'read',
  'report',
  'save',
  'submit',
  'subscribe',
  'vote',
  // 'wikiedit',
  // 'wikiread',
];

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

async function isAccessTokenExpired(ctx) {
  const expiresAt = get(ctx.store.state, 'auth.OAuthData.expires_at', 0);
  const isExpired = expiresAt >= Date.now() + 500;
  // console.log('isAccessTokenExpired', { isExpired, expiresAt });
  return expiresAt >= Date.now() + 500;
}

async function getAccessToken(ctx) {
  // console.log('getAccessToken');
  if (isAccessTokenExpired(ctx)) {
    await ctx.store.dispatch('auth/fetchRefreshedAccessToken');
  }
  return get(ctx.store.state, 'auth.OAuthData.access_token');
}

function now() {
  return Date.now() / 1000;
}
