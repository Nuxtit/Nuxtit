import get from 'lodash/get';
import filter from 'lodash/filter';
import * as ls from '~/lib/ls';
import now from '~/lib/now';

const SEARCHES = 'Searches';

export const state = () => {
  return {
    [SEARCHES]: ls.get(SEARCHES) || [],
  };
};

export const mutations = {
  ...ls.syncVuexMutators([SEARCHES]),
};

export const actions = {
  set({ state, commit }, input) {
    if (input && input.name) {
      commit(SEARCHES, {
        ...state[SEARCHES],
        [input.name]: {
          ...input,
        },
      });
    }
  },
  remove({ state, commit }, name) {
    if (name) {
      commit(SEARCHES, {
        ...state[SEARCHES],
        [name]: void 0,
      });
    }
  },
  flush({ commit }) {
    commit(SEARCHES, []);
  },
};

export const getters = {
  list(state) {
    return state[SEARCHES] || {};
  },
  count(state) {
    return get(state[SEARCHES], 'length') || 0;
  },
  find(state) {
    return name => {
      return find(state[SEARCHES], entry => entry.name === name);
    };
  },
};
