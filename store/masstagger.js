import axios from 'axios';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import qs from 'qs';
import { isBot } from '~/lib/bots';
import { Kind } from '~/lib/enum';

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
    // console.log('masstagger.mutations.merge', { newValues });
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
    if (!this.app.context.sharedWorker) return;

    const users = {};

    crawlTree(mixedTree, u => {
      if (isString(u)) {
        users[u.toUpperCase()] = true;
      }
    });

    delete users['[DELETED]'];
    delete users['[REMOVED]'];

    if (!mtTagMe && username) {
      delete users[username];
    }

    for (let key in users) {
      if (state.cache[key] || isBot(key)) {
        // already pending
        delete users[key];
      }
    }

    // record pending...
    commit('merge', users);

    // console.log({ users });
    this.app.context.sharedWorker.port.postMessage({
      fetchTags: {
        users,
        mtMin,
      },
    });
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
  isAvailable(state) {
    return 'SharedWorker' in window;
  },
};

function crawlTree(mt, addUser) {
  if (!mt) return;
  if (isArray(mt)) {
    for (let i = mt.length - 1; i >= 0; i--) {
      crawlTree(mt[i], addUser);
    }
  }
  if (mt.kind === Kind.User && mt.data) {
    addUser(mt.data.name);
  }
  addUser(mt.author);
  addUser(mt.approved_by);
  addUser(mt.mod_reason_by);
  addUser(mt.banned_by);
  crawlTree(mt.data, addUser);
  crawlTree(mt.children, addUser);
  crawlTree(mt.things, addUser);
}
