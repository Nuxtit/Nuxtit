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
      SubscribeButton(
        v-if='subreddit.data.name'
        :item='subreddit'
      )
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
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

    pre(v-if='showSource')
      tt: small(v-text="subreddit.data")
    b-nav(tabs)
      b-nav-item(
        :to='`/r/${$route.params.subreddit}`'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Posts
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/description`'
      )
        i.fa.fa-fw.fa-btn.fa-book
        | &#32;
        | Description
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/community-details`'
      )
        i.fa.fa-fw.fa-btn.fa-book
        | &#32;
        | Community Details
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/submit`'
      )
        i.fa.fa-fw.fa-btn.fa-pencil-square-o
        | &#32;
        | {{ subreddit.data.submit_text_label || "Submit a new link" }}
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/submit?selftext=true`'
      )
        i.fa.fa-fw.fa-btn.fa-pencil-square-o
        | &#32;
        | {{ subreddit.data.submit_link_label || "Submit a new text post" }}
    .row.clearfix
      .col.col-12.col-sm-12.col-md-4.col-lg-3.col-xl-3.order-md-12(
        v-if='showSideBar'
      )
        CommunityDetails(:subreddit='subreddit')
      .col.order-md-1
        nuxt-child(:subreddit='subreddit')
</template>

<script>
import first from 'lodash/first';
import bImg from 'bootstrap-vue/es/components/image/img';
import bNav from 'bootstrap-vue/es/components/nav/nav';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import CommunityDetails from '~/components/CommunityDetails';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import FlairBadge from '~/components/FlairBadge';
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
    bNav,
    bNavItem,
    CommunityDetails,
    FlairBadge,
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
    showSideBar() {
      return ![
        'r-subreddit-description',
        'r-subreddit-community-details',
      ].includes(this.$route.name);
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
