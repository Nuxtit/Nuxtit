const prefix = 'nrc_';

export function get(key, defaultValue = null) {
  try {
    const rawValue = window.localStorage.getItem(`${prefix}${key}`);
    const parsedValue = JSON.parse(rawValue);
    return parsedValue;
  } catch (err) {
    console.error(err);
    return defaultValue;
  }
}

export function set(key, value) {
  try {
    const json = JSON.stringify(value);
    window.localStorage.setItem(`${prefix}${key}`, json);
  } catch (err) {
    console.error(err);
  }
}
export function syncVuexMutators(arr) {
  return arr.reduce((carry, key) => {
    carry[key] = (state, payload) => {
      if (payload instanceof StorageEvent) {
        state[key] = payload.newValue;
      } else {
        set(key, payload);
        state[key] = payload;
      }
    };
    return carry;
  }, {});
}
export function addSyncVuexListener({ syncMap, commit }) {
  window.addEventListener('storage', event => {
    if (event.key === null) {
      Object.values(syncMap).forEach(mutator => {
        commit(mutator, {});
      });
    } else if (syncMap[event.key]) {
      commit(syncMap[event.key], event);
    }
  });
}
