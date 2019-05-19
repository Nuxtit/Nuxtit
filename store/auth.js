import axios from 'axios';
import get from 'lodash/get';
import * as ls from '~/lib/ls';
import { fetchAccessToken, fetchRefreshedAccessToken } from '~/plugins/reddit';
import now from '~/lib/now';

export const state = () => {
  const initData = {
    tmpOAuthData: null,
    Current: ls.get('Current') || get(ls.get('MeData'), 'name') || null,
    Accounts: ls.get('Accounts') || {},
  };

  if (
    get(ls.get('MeData'), 'name') &&
    !initData.Accounts[get(ls.get('MeData'), 'name')]
  ) {
    initData.Accounts[get(ls.get('MeData'), 'name')] = {
      MeData: ls.get('MeData'),
      OAuthData: ls.get('OAuthData'),
    };
  }

  ls.forget('MeData');
  ls.forget('OAuthData');

  return initData;
};

export const mutations = {
  ...ls.syncVuexMutators(['Current', 'Accounts']),
  tmpOAuthData(state, newValue) {
    state.tmpOAuthData = newValue;
  },
};

export const actions = {
  async setCurrent({ state, commit }, username) {
    commit('Current', username);
  },
  async fetchMe({ state, commit }, username) {
    const { reddit } = this.app.context;

    try {
      const response = await reddit.get('api/v1/me', { username });
      response.data.fetchedAt = now();
      if (response.data.name) {
        const MeData = {
          ...get(state, `Accounts.${response.data.name}.MeData`),
          ...response.data,
        };
        commit('Accounts', {
          ...get(state, 'Accounts'),
          [response.data.name]: {
            ...get(state, `Accounts.${response.data.name}`),
            MeData,
          },
        });
        return MeData;
      }
    } catch (err) {
      if (!username && get(err.response, 'status') === 401) {
        this.$router.push('/login');
      } else {
        throw err;
      }
    }
  },
  async fetchAccessToken({ state, commit }, params) {
    const response = await fetchAccessToken(params);
    if (params.username) {
      commit('Accounts', {
        ...get(state, 'Accounts'),
        [params.username]: {
          ...get(state, `Accounts.${params.username}`),
          OAuthData: {
            ...get(state, `Accounts.${params.username}.OAuthData`),
            ...response.data,
          },
        },
      });
    } else {
      commit('tmpOAuthData', response.data);
    }
    return response;
  },
  async fetchRefreshedAccessToken({ commit, state }, params) {
    const response = await (params.username
      ? fetchRefreshedAccessToken(
          get(state, `Accounts.${params.username}.OAuthData`),
        )
      : fetchRefreshedAccessToken(get(state, 'tmpOAuthData')));
    if (params.username) {
      commit('Accounts', {
        ...get(state, 'Accounts'),
        [params.username]: {
          ...get(state, `Accounts.${params.username}`),
          OAuthData: {
            ...get(state, `Accounts.${params.username}.OAuthData`),
            expires_at: Date.now() + response.data.expires_in,
            ...response.data,
          },
        },
      });
    } else {
      commit('tmpOAuthData', {
        ...get(state, 'tmpOAuthData'),
        expires_at: Date.now() + response.data.expires_in,
        ...response.data,
      });
    }
  },
  async logout({ state, commit }, username) {
    if (username) {
      const newData = {
        ...get(state, 'Accounts'),
      };
      delete newData[username];
      commit('Accounts', newData);
    } else {
      commit('Current', null);
      commit('tmpOAuthData', null);
    }
  },
  async setTmpOAuthData({ commit }, username) {
    commit('tmpOAuthData', null);
  },
  async moveTmpOAuthData({ state, commit }, username) {
    if (username) {
      commit('Accounts', {
        ...get(state, 'Accounts'),
        [username]: {
          ...get(state, `Accounts.${username}`),
          OAuthData: {
            ...get(state, `Accounts.${username}.OAuthData`),
            ...get(state, 'tmpOAuthData'),
          },
        },
      });
      commit('tmpOAuthData', null);
    }
  },
};

export const getters = {
  list(state) {
    return get(state, 'Accounts', {});
  },
  fetchedAt(state, { MeData }) {
    return get(MeData, 'fetchedAt');
  },
  isAuthenticated(state, { MeData }) {
    return !!get(MeData, 'name');
  },
  MeData(state, { username }) {
    return get(state, `Accounts.${username}.MeData`) || {};
  },
  OAuthData(state, { username }) {
    return get(state, `Accounts.${username}.OAuthData`);
  },
  username(state) {
    return get(state, 'Current');
  },
  usernames(state) {
    return Object.values(state.Accounts)
      .filter(data => data && data.OAuthData && data.MeData && data.MeData.name)
      .map(data => data.MeData.name);
  },
};
