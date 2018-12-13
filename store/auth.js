import axios from 'axios';
import get from 'lodash/get';
import * as ls from '~/lib/ls';
import { fetchAccessToken, fetchRefreshedAccessToken } from '~/plugins/reddit';
import now from '~/lib/now';

export const state = () => {
  return {
    OAuthData: ls.get('OAuthData'),
    MeData: ls.get('MeData'),
  };
};

export const mutations = {
  ...ls.syncVuexMutators(['OAuthData', 'MeData']),
};

export const actions = {
  async fetchMe({ commit }) {
    const { reddit } = this.app.context;

    try {
      const response = await reddit.get('api/v1/me');
      response.data.fetchedAt = now();
      commit('MeData', response.data);
    } catch (err) {
      if (get(err.response, 'status') === 401) {
        this.$router.push('/login');
      } else {
        throw err;
      }
    }
  },
  async fetchAccessToken({ commit }, params) {
    const response = await fetchAccessToken(params);
    commit('OAuthData', {
      ...state.OAuthData,
      ...response.data,
    });
  },
  async fetchRefreshedAccessToken({ commit, state }) {
    const response = await fetchRefreshedAccessToken(state.OAuthData);
    commit('OAuthData', {
      ...state.OAuthData,
      expires_at: Date.now() + response.data.expires_in,
      ...response.data,
    });
  },
  async logout({ commit }) {
    commit('OAuthData', null);
    commit('MeData', null);
  },
};

export const getters = {
  fetchedAt(state) {
    return get(state, 'MeData.fetchedAt');
  },
  isAuthenticated(state) {
    return !!get(state, 'MeData.name');
  },
  username(state) {
    return get(state, 'MeData.name');
  },
};
