import axios from 'axios';
import get from 'lodash/get';
import isInteger from 'lodash/isInteger';
import isObject from 'lodash/isObject';
import qs from 'qs';
import { Mutex } from 'async-mutex';

// console.log('mtw/sharedworker.js');

/* eslint-disable */

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

// The point of the mutex is to reduce the load
// on masstagger to one API at a time
// so if you open 5+ tabs it will be
// 5+ sequential requests instead of
// concurrent, where each sequential
// request might use a partial cache
// from a previous request
const mutex = new Mutex();
const cache = {};

export async function fetchTags (event, port) {
  const release = await mutex.acquire();

  // console.log(event.data);
  // console.log('event.data && isObject(event.data)', event.data, isObject(event.data));
  if (isObject(event.data.fetchTags)) {
    const { users, mtMin } = event.data.fetchTags;
    try {
      // console.log('isObject(event.data.users) && isInteger(mtMin)', isObject(event.data.users), isInteger(mtMin));
      if (isObject(users) && isInteger(mtMin)) {
        const preCached = {};

        for (let key in users) {
          if (cache.hasOwnProperty(key)) {
            // already acquired
            preCached[key] = cache[key];
            delete users[key];
          }
        }

        // console.log('preCached', Object.keys(preCached).length, preCached);
        if (Object.keys(preCached).length > 0) {
          port.postMessage({
            fetchedTags: preCached,
          });
        }

        const userNamesList = Object.keys(users);
        if (userNamesList.length === 0) {
          // console.log('userNamesList.length === 0', userNamesList.length, userNamesList);
          return;
        }

        // console.log('fetching /users/subs', { userNamesList });
        const response = await masstagger.post('/users/subs', {
          users: JSON.stringify(userNamesList),
        }, {
          params: {
            min: mtMin,
          },
        });
        // console.log('fetched /users/subs');
        const data = {};
        if (response.data.users) {
          for (let i = response.data.users.length - 1, user; i >= 0; i--) {
            user = response.data.users[i];
            data[user.username] = get(user.subreddits, 'length')
              ? 'posts in: ' +
                user.subreddits.map(sr => '/r/' + sr).join(', ')
              : '';
          }
        }

        Object.assign(cache, data);
        // console.log(
        //   'static/sharedworker.js',
        //   'postMessage',
        //   data
        // );
        port.postMessage({
          fetchedTags: data,
        });
      }
    } catch (err) {
      console.error(err);
      port.postMessage({
        fetchedTags: {
          failed: true,
          users,
          err: {
            message: (err && err.message) || new String(err),
          }
        },
      });
    } finally {
      release();
    }
  }
}
