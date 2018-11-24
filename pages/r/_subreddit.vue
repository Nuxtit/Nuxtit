<template lang="pug">
  div
    .container.subreddit-banner(:style='subredditBannerStyles')
      br
      b-img.profile-icon-img(
        v-if="subreddit.data.icon_img"
        :src="subreddit.data.icon_img"
        thumbnail
        width="128"
        height="128"
      )
      br
      br
      br
    h3 /r/{{subreddit.data.display_name}}
    h4 {{subreddit.data.title}}
    p {{subreddit.data.subscribers}} subscribers
    p
      nuxt-link.btn.btn-primary(
        :to='`/r/${$route.params.subreddit}/submit`'
      )
        | Submit a new link
      nuxt-link.btn.btn-primary(
        :to='`/r/${$route.params.subreddit}/submit?selftext=true`'
      )
        | Submit a new text post
      SubscribeButton(
        v-if='subreddit.data.name'
        :item='subreddit'
      )
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-code
        span see source
    p
      | Your flair on this sub looks like:
      | &#32;
      UserLink(:username='MeData.name')
      | &#32;
      FlairBadge(
        :item='subreddit'
        type='user'
        show-none
      )

    //- ItemHtml(:value='subreddit.data.description_html')
    //- hr
    //- pre: tt {{ {subreddit} }}
    //- pre: tt {{ {sidebar} }}
    //- pre: tt {{ {rules} }}


    pre(v-if='showSource')
      tt: small(v-text="subreddit.data")
    hr
    nuxt-child(:subreddit='subreddit')
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
import { isVirtualSubreddit, makeVirtualSubreddit } from '~/lib/subreddit';
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
  computed: {
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
    showSource: makeComputeToggler('source'),
    subredditBannerStyles() {
      const subreddit = this.subreddit.data;
      const banner_img = subreddit ? subreddit.banner_img : null;
      return {
        'background-image': banner_img
          ? `url("${subreddit.banner_img}")`
          : null,
      };
    },
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
      subreddit: (await reddit.get(`/r/${subreddit}/about`)).data,
      // rules: (await reddit.get(`/r/${subreddit}/about/rules`)).data,
      // docs are wrong, DNE
      // sidebar: (await reddit.get(`/r/${subreddit}/sidebar`)).data,
      // returns empty data:
      // sidebar: (await reddit.get(`/r/${subreddit}/about/sidebar`)).data,
    };
  },
};
</script>
