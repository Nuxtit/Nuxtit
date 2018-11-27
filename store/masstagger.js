import axios from 'axios';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import sleep from '~/lib/sleep';
import qs from 'qs';
import Vue from 'vue';

const masstagger = axios.create({
  baseURL: '/masstagger',
  headers: {
    'App-Name': 'Redusa-Nuxt-Reddit-Client',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  responseType: 'json',
  maxRedirects: 0,
  transformRequest(data, headers) {
    return qs.stringify(data, {
      // arrayFormat: 'brackets',
    });
  },
});

export const state = () => ({
  cache: {},
  pending: {},
});

export const mutations = {
  merge(state, newValues) {
    state.cache = {
      ...state.cache,
      ...newValues,
    };
  },
  pending(state, username) {
    state.pending[username] = true;
  },
  notPending(state, username) {
    Vue.delete(state.pending, username);
  },
};

export const actions = {
  async require({ state, dispatch, commit }, username) {
    if (get(state.cache, username)) return;
    if (state.pending[username]) return;
    commit('pending', username);
    dispatch('fetchTags');
  },
  fetchTags: debounce(async function({ state, commit }) {
    await sleep(5);
    const users = Object.keys(state.pending).map(s => s.toUpperCase());
    const response = await masstagger.post(
      '/users/subs',
      {
        users: JSON.stringify(users),
      },
      {
        params: {
          min: 5,
        },
      },
    );
    const data = {};
    if (response.data.users) {
      for (let i = response.data.users.length - 1, user; i >= 0; i--) {
        user = response.data.users[i];
        data[user.username] = get(user.subreddits, 'length')
          ? 'posts in: ' + user.subreddits.map(sr => '/r/' + sr).join(', ')
          : '';
        commit('notPending', user.username);
      }
    }
    commit('merge', data);
  }, 25),
};

export const getters = {
  find(state) {
    return username => {
      console.log('find', username.toUpperCase(), state.cache);
      if (username) {
        return state.cache[username.toUpperCase()];
      }
    };
  },
};
