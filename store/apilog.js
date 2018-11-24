import get from 'lodash/get';
import * as ls from '~/lib/ls';

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
  add({ state, commit }, response) {
    // console.log('apiLog.actions.add().response', response);
    const entry = response.config.apiLog;
    const { baseURL } = response.config;
    entry.end = now();
    entry.ms = (entry.end - entry.start) * 1000;
    entry.status = response.status;
    entry.path = response.config.url.replace(baseURL, '/');
    entry.fullPath = response.request.responseURL.replace(baseURL, '/');
    entry.data = response.config.data;
    entry.params = response.config.params;
    entry.method = response.config.method;
    entry.result = response.data;

    // console.log('apiLog.actions.add().entry', entry);

    commit(APILOG, [entry, ...state[APILOG]].slice(0, 32));
  },
};

export const getters = {
  list(state) {
    return state[APILOG] || [];
  },
  count(state) {
    return get(state[APILOG], 'length') || 0;
  },
  find(state) {
    return timestamp => {
      return find(state[APILOG], entry => entry.timestamp === timestamp);
    };
  },
};

function now() {
  return Date.now() / 1000;
}
