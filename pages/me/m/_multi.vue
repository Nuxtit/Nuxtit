<template lang="pug">
  div
    h3 /r/{{multi.data.display_name}}
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
    nuxt-child(:multi='multi')
</template>

<script>
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import ItemHtml from '~/components/ItemHtml';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import SubscribeButton from '~/components/SubscribeButton.vue';
import UserLink from '~/components/UserLink';
import RedditItems from '~/mixins/RedditItems';
import { makeVirtualSubreddit } from '~/lib/subreddit';
import { makeComputeToggler } from '~/lib/toggle_open';

export default {
  middleware: ['auth'],
  defaultSort: 'hot',
  components: {
    bNav,
    bNavItem,
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
    return {
      multi: makeVirtualSubreddit(multi),
    };
  },
};
</script>
