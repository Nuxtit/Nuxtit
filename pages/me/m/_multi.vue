<template lang="pug">
  div
    h3 /r/{{multi.data.display_name}}
    nuxt-child(:multi='multi')
</template>

<script>
import first from 'lodash/first';
import bImg from 'bootstrap-vue/es/components/image/img';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import FlairBadge from '~/components/FlairBadge';
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
    bImg,
    FlairBadge,
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
