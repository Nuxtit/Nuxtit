<template lang="pug">
  div
    h3 /r/{{multi.display_name}}
    b-nav(tabs)
      b-nav-item(
        :to='`/me/m/${$route.params.multi}`'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Posts
      b-nav-item(
        :to='`/me/m/${$route.params.multi}/comments`'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Comments
      b-nav-item(
        :to='{ path: "/pushshift/search/", query: { kind: "comment", subreddit: multi.subreddits.map(s=>s.name).join(",") } }'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Pushshift
    nuxt-child(:multi='multi')
</template>

<script>
import ValidatePostSort from '~/mixins/ValidatePostSort';
import ItemHtml from '~/components/ItemHtml';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import SubscribeButton from '~/components/SubscribeButton.vue';
import UserLink from '~/components/UserLink';
import RedditItems from '~/mixins/RedditItems';
import { makeVirtualSubreddit } from '~/lib/subreddit';
import { makeComputeToggler } from '~/lib/toggle_open';
import find from 'lodash/find';
import undata from '~/lib/undata';

export default {
  middleware: ['auth'],
  defaultSort: 'hot',
  components: {
    ItemHtml,
    PostList,
    RedditPagination,
    SubscribeButton,
    UserLink,
  },
  data() {
    return {
      open: null,
    };
  },
  async asyncData({ store, reddit, route }) {
    const { multi } = route.params;
    const multis = await reddit.get(`/api/multi/mine`);
    //eslint-disable-next-line
    // console.log(multis.data, multi, find(multis.data, m => m.data.name === multi));
    return {
      multi: undata(find(multis.data, m => m.data.name === multi)),
    };
  },
};
</script>
