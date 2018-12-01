import axios from 'axios';
import get from 'lodash/get';
import * as ls from '~/lib/ls';
import { fetchAccessToken, fetchRefreshedAccessToken } from '~/plugins/reddit';

export const state = () => {
  return {
    Settings: ls.get('Settings'),
  };
};

export const mutations = {
  ...ls.syncVuexMutators(['Settings']),
};

export const actions = {
  async censorUsernames({ state, commit }, value) {
    commit('Settings', {
      ...state.Settings,
      censorUsernames: !!value,
    });
  },
};

export const getters = {
  censorUsernames(state) {
    return !!get(state, 'Settings.censorUsernames');
  },
};
