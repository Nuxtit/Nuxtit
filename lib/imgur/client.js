import axios from 'axios';

export const client = axios.create({
  // baseURL: 'https://api.imgur.com/3/',
  baseURL: '/api-imgur/',
  headers: {
    Authorization: `Client-ID ${process.env.imgurClientId}`,
  },
  responseType: 'json',
  maxRedirects: 0,
});

export default client;
