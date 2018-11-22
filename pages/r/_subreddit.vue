<template lang="pug">
  div
    h3 /r/{{subreddit.data.display_name}}
    h4 {{subreddit.data.title}}
    p
      nuxt-link.btn.btn-primary(
        :to='`/r/${$route.params.subreddit}/submit`'
      )
        | Submit a new link
      nuxt-link.btn.btn-primary(
        :to='`/r/${$route.params.subreddit}/submit?selftext=true`'
      )
        | Submit a new text post
    //- ItemHtml(:value='subreddit.data.description_html')
    //- hr
    //- pre: tt {{ {subreddit} }}
    //- pre: tt {{ {sidebar} }}
    //- pre: tt {{ {rules} }}
    hr
    nuxt-child(:subreddit='subreddit')
</template>

<script>
import first from 'lodash/first';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import ItemHtml from '~/components/ItemHtml';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
import { isVirtualSubreddit, makeVirtualSubreddit } from '~/lib/subreddit';

export default {
  middleware: ['auth'],
  defaultSort: 'hot',
  components: {
    ItemHtml,
    PostList,
    RedditPagination,
  },
  async asyncData({ store, reddit, route }) {
    const { subreddit } = route.params;
    if (isVirtualSubreddit(subreddit)) {
      return {
        subreddit: makeVirtualSubreddit(subreddit),
        sidebar: null,
      };
    }
    return {
      subreddit: await store.dispatch('subreddits/require', subreddit),
      // subreddit: (await reddit.get(`/r/${subreddit}/about`)).data,
      // rules: (await reddit.get(`/r/${subreddit}/about/rules`)).data,
      // docs are wrong, DNE
      // sidebar: (await reddit.get(`/r/${subreddit}/sidebar`)).data,
      // returns empty data:
      // sidebar: (await reddit.get(`/r/${subreddit}/about/sidebar`)).data,
    };
  },
};
</script>
