import axios from 'axios';

export const client = axios.create({
  baseURL: '/.netlify/functions',
  headers: {
    // authorization: '',
  },
  responseType: 'json',
  maxRedirects: 0,
});

export default client;
