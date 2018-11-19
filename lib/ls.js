const prefix = 'nrc_';

export default {
  get(key, defaultValue = null) {
    try {
      const rawValue = window.localStorage.getItem(`${prefix}${key}`);
      const parsedValue = JSON.parse(rawValue);
      return parsedValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      const json = JSON.stringify(value);
      window.localStorage.setItem(`${prefix}${key}`, json);
    } catch (err) {
      console.error(err);
    }
  },
};
