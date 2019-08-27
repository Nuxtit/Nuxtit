import get from 'lodash/get';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import * as ls from '~/lib/ls';
import now from '~/lib/now';

const APILOG = 'ApiLog';

export const state = () => {
  return {
    [APILOG]: ls.get(APILOG) || [],
  };
};

export const mutations = {
  ...ls.syncVuexMutators([APILOG]),
};

export const actions = {
  add({ state, commit }, input) {
    const response = input.response || input;
    const config = get(response, 'config') || {};
    // console.log('apiLog.actions.add().response', response);
    const entry = get(config, 'apiLog') || {};
    const { baseURL } = config;
    entry.end = now();
    entry.ms = (entry.end - entry.start) * 1000;
    entry.status = response.status;
    if (isString(config.url)) {
      entry.path = config.url.replace(baseURL, '/');
    }
    entry.fullPath = response.request.responseURL.replace(baseURL, '/');
    entry.data = config.data;
    entry.params = config.params;
    entry.method = config.method;
    if (entry.status !== 200) {
      entry.result = response.data;
    }

    // console.log('apiLog.actions.add().entry', entry);

    commit(APILOG, [entry, ...state[APILOG]].slice(0, 32));
  },
  flush({ commit }) {
    commit(APILOG, []);
  },
};

export const getters = {
  list(state) {
    return state[APILOG] || [];
  },
  count(state) {
    return get(state[APILOG], 'length') || 0;
  },
  errorCount(state) {
    return filter(state[APILOG], entry => entry.status >= 300).length;
  },
  find(state) {
    return timestamp => {
      return find(state[APILOG], entry => entry.timestamp === timestamp);
    };
  },
};
