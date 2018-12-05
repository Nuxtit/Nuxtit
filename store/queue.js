import reject from 'lodash/reject';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import first from 'lodash/first';
import get from 'lodash/get';
import * as ls from '~/lib/ls';

// for today, we assume all queue entries are valid Redua
// internal links
const QUEUE = 'Queue';

export const state = () => {
  return {
    [QUEUE]: ls.get(QUEUE) || [],
  };
};

export const mutations = {
  ...ls.syncVuexMutators([QUEUE]),
};

export const actions = {
  pop({ state, commit }) {
    if (state[QUEUE].length > 0) {
      commit(QUEUE, state[QUEUE].slice(1));
      return state[QUEUE][0];
    }
  },
  add({ state, commit }, entry) {
    commit(QUEUE, [...state[QUEUE], entry]);
  },
  remove({ state, commit }, entry) {
    commit(QUEUE, reject(state[QUEUE], e => isSameEntry(e, entry)));
  },
  flush({ commit }) {
    commit(QUEUE, []);
  },
  pop({ dispatch, getters }) {
    const entry = getters.first;
    console.log(entry);
    if (entry) {
      dispatch('remove', entry);
      this.$router.push(entry.route);
    }
  },
};

export const getters = {
  list(state) {
    return state[QUEUE] || [];
  },
  count(state) {
    return get(state[QUEUE], 'length') || 0;
  },
  findIndex(state) {
    return entry => {
      return findIndex(state[QUEUE], e => isSameEntry(e, entry));
    };
  },
  find(state) {
    return entry => {
      return find(state[QUEUE], e => isSameEntry(e, entry));
    };
  },
  first(state) {
    return first(state[QUEUE]);
  },
};

function isSameEntry(e1, e2) {
  if (e1 && e2) {
    if (e1 === e2) {
      return true;
    }
    if (e1.name && e1.name === e2.name) {
      return true;
    }
  }
  return false;
}
