import axios from 'axios';
import get from 'lodash/get';
import * as ls from '~/lib/ls';
import { options, Types } from '~/lib/settings';

export const state = () => {
  return {
    Settings: {
      ...options.reduce((carry, { key, defaultValue }) => {
        carry[key] = defaultValue;
        return carry;
      }, {}),
      ...ls.get('Settings', {}),
    },
  };
};

export const mutations = {
  ...ls.syncVuexMutators(['Settings']),
};

export const actions = {
  ...options.reduce((carry, { key, action, type }) => {
    if (action) {
      carry[key] = action;
    } else if (type === Types.Boolean) {
      carry[key] = ({ commit, state }, value) => {
        value = !!value;
        if (state[key] !== value) {
          commit('Settings', {
            ...state.Settings,
            [key]: value,
          });
        }
      };
    } else if (type === Types.BooleanNullable) {
      carry[key] = ({ commit, state }, value) => {
        value = value === null ? null : !!value;
        if (state[key] !== value) {
          commit('Settings', {
            ...state.Settings,
            [key]: value,
          });
        }
      };
    } else if (type === Types.Integer) {
      carry[key] = ({ commit, state }, value) => {
        value = parseInt(value);
        if (isNaN(value)) {
          value = isNaN(defaultValue) ? 0 : defaultValue;
        }
        if (state[key] !== value) {
          commit('Settings', {
            ...state.Settings,
            [key]: value,
          });
        }
      };
    } else if (type === Types.Text) {
      carry[key] = ({ commit, state }, value) => {
        value = `${value}`;
        if (state[key] !== value) {
          commit('Settings', {
            ...state.Settings,
            [key]: value,
          });
        }
      };
    } else if (type === Types.MapString) {
      carry[key] = ({ commit, state }, value) => {
        // value = `${value}`;
        if (state[key] !== value) {
          commit('Settings', {
            ...state.Settings,
            [key]: value,
          });
        }
      };
    } else {
      throw new Error('undefined action');
    }
    return carry;
  }, {}),
};

export const getters = {
  ...options.reduce((carry, { key, getter }) => {
    carry[key] = getter || (state => state.Settings[key]);
    return carry;
  }, {}),
};
