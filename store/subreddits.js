import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
import * as ls from '~/lib/ls';

export const state = () => {
  return {
    SrCache: ls.get('SrCache') || [],
  };
};

export const mutations = {
  ...ls.syncVuexMutators(['SrCache']),
};

export const actions = {
  async fetch({ state, commit }, subreddit) {
    const { reddit } = this.app.context;
    try {
      const sr = (await reddit.get(`/r/${subreddit}/about`)).data;
      console.log('all', state.SrCache.length);
      commit(
        'SrCache',
        [
          sr,
          ...filter(
            state.SrCache,
            entry => entry.data.display_name !== sr.data.display_name,
          ),
        ].slice(0, 16),
      );
      return sr;
    } catch (err) {
      if (get(err.response, 'status') === 401) {
        this.$router.push('/login');
      } else {
        throw err;
      }
    }
  },
  async require({ state, dispatch, commit }, subreddit) {
    const cached = getters.find(state)(subreddit);
    if (cached) {
      return cached;
    }
    return dispatch('fetch', subreddit);
  },
};

export const getters = {
  find(state) {
    return subreddit => {
      const lc = `${subreddit}`.toLowerCase();
      return find(state.SrCache, entry => {
        const display_name = get(entry, 'data.display_name');
        // eslint-disable-next-line
        console.log(`${display_name}`.toLowerCase(), `${display_name}`.toLowerCase() === lc, lc);
        if (`${display_name}`.toLowerCase() === lc) {
          return true;
        }
        return false;
      });
    };
  },
};
