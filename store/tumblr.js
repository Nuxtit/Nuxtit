import get from 'lodash/get';
import * as ls from '~/lib/ls';
import tumblr from '~/lib/tumblr/client';

const USERINFO = 'tumblrUserInfo';

export const state = () => ({
  [USERINFO]: ls.get(USERINFO),
});

export const mutations = {
  ...ls.syncVuexMutators([USERINFO]),
};

export const actions = {
  async fetchUserInfo({ commit, rootGetters, rootState, state }) {
    const response = await tumblr.post('/userInfo', {
      ...apikeys(rootState),
    });

    commit(USERINFO, response.data);
  },
  async apiCall({ rootState }, { blogName, options, apiCall }) {
    return tumblr.post('/tumblr', {
      ...apikeys(rootState),
      apiCall,
      blogName,
      options,
    });
  },
  async fetchBlogPosts({ rootState }, { blogName, options }) {
    return tumblr.post('/blogPosts', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async fetchBlogQueue({ rootState }, { blogName, options }) {
    return tumblr.post('/blogQueue', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async fetchBlogSubmissions({ rootState }, { blogName, options }) {
    return tumblr.post('/blogSubmissions', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async fetchUserDashboard({ rootState }, { blogName, options }) {
    return tumblr.post('/userDashboard', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async updateBlogPost({ rootState }, { blogName, options }) {
    return tumblr.post('/editPost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async deletePost({ rootState }, { blogName, options }) {
    return tumblr.post('/deletePost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async createLinkPost({ rootState }, { blogName, options }) {
    return tumblr.post('/createLinkPost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async createPhotoPost({ rootState }, { blogName, options }) {
    return tumblr.post('/createPhotoPost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async createVideoPost({ rootState }, { blogName, options }) {
    return tumblr.post('/createVideoPost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
  async createTextPost({ rootState }, { blogName, options }) {
    return tumblr.post('/createTextPost', {
      ...apikeys(rootState),
      blogName,
      options,
    });
  },
};

export const getters = {
  blogs(state) {
    return get(state[USERINFO], 'user.blogs', []);
  },
  noBlogs(state) {
    return !(get(state[USERINFO], 'user.blogs.length', 0) > 0);
  },
};

function apikeys(rootState) {
  const settings = rootState.settings.Settings;
  return {
    consumer_key: settings.tumblrConsumerKey,
    consumer_secret: settings.tumblrConsumerSecret,
    token: settings.tumblrToken,
    token_secret: settings.tumblrTokenSecret,
  };
}
