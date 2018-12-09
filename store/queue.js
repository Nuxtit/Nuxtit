import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import first from 'lodash/first';
import last from 'lodash/last';
import get from 'lodash/get';
import reject from 'lodash/reject';
import shuffle from 'lodash/shuffle';
import * as ls from '~/lib/ls';

// for today, we assume all queue entries are valid Redua
// internal links
const QUEUE = 'Queue';
const DONE = 'QueueDone';

export const state = () => {
  return {
    [QUEUE]: ls.get(QUEUE) || [],
    [DONE]: ls.get(DONE) || [],
  };
};

export const mutations = {
  ...ls.syncVuexMutators([QUEUE, DONE]),
};

export const actions = {
  add({ state, commit }, entry) {
    commit(QUEUE, [...reject(state[QUEUE], e => isSameEntry(e, entry)), entry]);
  },
  requeue({ state, commit }, entry) {
    commit(QUEUE, [...reject(state[QUEUE], e => isSameEntry(e, entry)), entry]);
  },
  done({ state, commit }, entry) {
    const fn = e => isSameEntry(e, entry);
    commit(QUEUE, reject(state[QUEUE], fn));
    commit(DONE, [entry, ...reject(state[DONE], fn)].slice(0, 16));
  },
  flush({ commit }) {
    commit(QUEUE, []);
    commit(DONE, []);
  },
  reverse({ state, commit }) {
    commit(QUEUE, (state[QUEUE] || []).reverse());
  },
  shuffle({ state, commit }) {
    commit(QUEUE, shuffle(state[QUEUE]));
  },
};

export const getters = {
  list(state) {
    return filter(state[QUEUE], Boolean);
  },
  doneList(state) {
    return filter(state[DONE], Boolean);
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
  last(state) {
    return last(state[QUEUE]);
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
    if (e1.route && e1.route === e2.route) {
      return true;
    }
  }
  return false;
}
