import axios from 'axios';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import qs from 'qs';

const masstagger = axios.create({
  baseURL: '/masstagger',
  headers: {
    'App-Name': 'Redusa-Nuxt-Reddit-Client',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  responseType: 'json',
  maxRedirects: 0,
  transformRequest(data, headers) {
    return qs.stringify(data, {
      // arrayFormat: 'brackets',
    });
  },
});

export const state = () => ({
  cache: {},
});

export const mutations = {
  merge(state, newValues) {
    state.cache = {
      ...state.cache,
      ...newValues,
    };
  },
};

export const actions = {
  async fetchTags({ commit, rootGetters, rootState, state }, mixedTree) {
    const mtMin = rootGetters['settings/mtMin'];
    const mtEnable = rootGetters['settings/mtEnable'];
    const mtTagMe = rootGetters['settings/mtTagMe'];
    const username = rootGetters['auth/username'];

    if (!mtEnable) return;

    const users = {};

    crawlTree(mixedTree, u => {
      if (isString(u)) {
        users[u.toUpperCase()] = true;
      }
    });

    if (!mtTagMe && username) {
      delete users[username];
    }

    for (let key in users) {
      if (state.cache[key]) {
        // already pending
        delete users[key];
      }
    }

    const userNamesList = Object.keys(users);
    if (userNamesList.length === 0) {
      return;
    }

    // record pending...
    commit('merge', users);

    // console.log({ users });

    const response = await masstagger.post(
      '/users/subs',
      {
        users: JSON.stringify(userNamesList),
      },
      {
        params: {
          min: mtMin,
        },
      },
    );
    const data = {};
    if (response.data.users) {
      for (let i = response.data.users.length - 1, user; i >= 0; i--) {
        user = response.data.users[i];
        data[user.username] = get(user.subreddits, 'length')
          ? 'posts in: ' + user.subreddits.map(sr => '/r/' + sr).join(', ')
          : '';
      }
    }

    for (let key in users) {
      if (!(data[key] && state.cache[key] === true)) {
        // we were expecting a result but now we have to cancel
        // pending
        data[key] = null;
      }
    }

    commit('merge', data);
  },
};

export const getters = {
  find(state) {
    return username => {
      if (username) {
        return state.cache[username.toUpperCase()];
      }
    };
  },
  cachedCount(state) {
    return Object.keys(state.cache).length;
  },
};

function crawlTree(mt, addUser) {
  if (!mt) return;
  if (isArray(mt)) {
    for (let i = mt.length - 1; i >= 0; i--) {
      crawlTree(mt[i], addUser);
    }
  }
  addUser(mt.author);
  addUser(mt.approved_by);
  addUser(mt.mod_reason_by);
  addUser(mt.banned_by);
  crawlTree(mt.data, addUser);
  crawlTree(mt.children, addUser);
  crawlTree(mt.things, addUser);
}
