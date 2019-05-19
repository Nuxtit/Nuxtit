import axios from 'axios';
import get from 'lodash/get';
import * as ls from '~/lib/ls';

export const state = () => ({
  windowActive: !!get(document, 'hidden'),
});

export const mutations = {
  windowActive(state, value) {
    state.windowActive = !!value;
  },
};

export const actions = {
  async nuxtClientInit({ state, dispatch, commit }, ctx) {
    const accessToken = get(ctx.store.state, 'auth.OAuthData.access_token');
    const username = get(state, 'auth.MeData.name');
    if (accessToken) {
      if (!username) {
        // @todo
        await dispatch('auth/fetchMe');
      }
    }

    ls.addSyncVuexListener({
      syncMap: {
        // OAuthData: 'auth/OAuthData',
        // MeData: 'auth/MeData',
        Current: 'auth/Current',
        Accounts: 'auth/Accounts',
        SrCache: 'subreddits/SrCache',
        History: 'history/History',
        ApiLog: 'apilog/ApiLog',
        Queue: 'queue/Queue',
        QueueDone: 'queue/QueueDone',
        Searches: 'searches/Searches',
      },
      commit,
    });
  },
};

export const strict = false;
