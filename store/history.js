import axios from 'axios';
import get from 'lodash/get';
import filter from 'lodash/filter';
import * as ls from '~/lib/ls';
import { fetchAccessToken, fetchRefreshedAccessToken } from '~/plugins/reddit';
import now from '~/lib/now';

const HISTORY = 'History';

export const state = () => {
  return {
    [HISTORY]: ls.get(HISTORY),
  };
};

export const mutations = {
  ...ls.syncVuexMutators([HISTORY]),
};

export const actions = {
  add({ state, commit }, route) {
    const firstEntry = get(state[HISTORY], '0');
    const entry = {
      timestamp: now(),
      path: route.path,
      name: route.name,
      params: route.params,
      subEntries: [
        {
          fullPath: route.fullPath,
          query: route.query,
          timestamp: now(),
        },
      ],
    };

    if (firstEntry && firstEntry.path === entry.path) {
      entry.timestamp = firstEntry.timestamp;
      entry.subEntries = [...entry.subEntries, ...firstEntry.subEntries];
    }

    commit(
      HISTORY,
      [
        entry,
        ...filter(
          state[HISTORY],
          e => e.timestamp !== entry.timestamp && e.path !== entry.path,
        ),
      ].slice(0, 32),
    );
  },
  flush({ commit }) {
    commit(HISTORY, []);
  },
};

export const getters = {
  list(state) {
    return state[HISTORY] || [];
  },
  count(state) {
    return get(state[HISTORY], 'length') || 0;
  },
  find(state) {
    return timestamp => {
      return find(state[HISTORY], entry => entry.timestamp === timestamp);
    };
  },
};
