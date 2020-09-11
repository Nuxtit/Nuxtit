import get from 'lodash/get';
import * as ls from '~/lib/ls';
import client_factory from '~/lib/pipes/client_factory';

const PIPEINFO = 'pipesInfo';

export const state = () => ({
  [PIPEINFO]: ls.get(PIPEINFO),
});

export const mutations = {
  ...ls.syncVuexMutators([PIPEINFO]),
};

export const actions = {
  // input { endpointName1: { ...options }, endpointName1: { ...options } }
  // both input and options will PATCH, not replace the target
  async saveEndpoints({ commit, state }, input) {
    const newData = {};
    Object.assign(newData, state[PIPEINFO]);

    newData.endpoints = newData.endpoints || {};

    Object.keys(input).map(name => {
      newData.endpoints[name] = Object.assign(
        {},
        newData.endpoints[name],
        input[name],
      );
    });

    commit(PIPEINFO, newData);
  },
  async deleteEndpoint({ commit, state }, name) {
    const newData = {
      ...state[PIPEINFO],
    };

    if (newData.endpoints) {
      const newEndoints = {
        ...newData.endpoints,
      };
      delete newEndoints[name];
      newData.endpoints = newEndoints;
    }

    commit(PIPEINFO, newData);
  },
};

export const getters = {
  endpoints(state) {
    return get(state[PIPEINFO], 'endpoints', {});
  },
  client(state) {
    return key => {
      const endpoint = get(state[PIPEINFO], `endpoints.${key}`, {});
      if (endpoint) {
        return client_factory(endpoint);
      } else {
        return null;
      }
    };
    return get(state[PIPEINFO], 'endpoints', {});
  },
  noEndpoints(state) {
    const endpoints = get(state[PIPEINFO], 'endpoints', null);
    return !(endpoints && Object.values(endpoints).length > 0);
  },
};
