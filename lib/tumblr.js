import axios from 'axios';

export const client = axios.create({
  baseURL: '/api-tumblr',
  headers: {
    // authorization: '',
  },
  responseType: 'json',
  maxRedirects: 0,
});

export default client;
