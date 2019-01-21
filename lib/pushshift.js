import axios from 'axios';
import get from 'lodash/get';
import isInteger from 'lodash/isInteger';
import isObject from 'lodash/isObject';

export const client = axios.create({
  baseURL: '/api-pushshift',
  headers: {
    'App-Name': 'Redusa-Nuxt-Reddit-Client',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  responseType: 'json',
  maxRedirects: 0,
  // transformRequest(data, headers) {
  //   return qs.stringify(data, {
  //     // arrayFormat: 'brackets',
  //   });
  // },
});

export default client;
