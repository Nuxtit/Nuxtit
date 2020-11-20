<template lang="pug">
  div
    .container.subreddit-banner(:style='subredditBannerStyles')
      br
      //- b-img.profile-icon-img(
      //-   v-if="subreddit.data.icon_img"
      //-   :src="subreddit.data.icon_img"
      //-   thumbnail
      //-   width="128"
      //-   height="128"
      //- )
      br
      br
      br
    h3(@click.prevent.stop="$write_clipboard(subreddit.data.display_name)")
      | /r/{{subreddit.data.display_name}}
    h4 {{subreddit.data.title}}
    p {{subreddit.data.subscribers}} subscribers
    p
      SubscribeButton(
        v-if='subreddit.data.name'
        :item='subreddit'
      )
      | &#32;
      a(:href="`https://old.reddit.com/r/${subreddit.data.display_name}`" target="_blank")
        i.fa.fa-fw.fa-btn.fa-reddit
        | &#32;
        span.small see on reddit
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        | &#32;see source
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

    pre.small.text-monospace(v-if='showSource' v-text="subreddit.data")
    b-nav(tabs)
      b-nav-item(
        :to='`/r/${$route.params.subreddit}`'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Posts
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/comments`'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Comments
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
        :to='`/r/${$route.params.subreddit}/wiki`'
      )
        i.fa.fa-fw.fa-btn.fa-book
        | &#32;
        | Wiki
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/submit`'
      )
        i.fa.fa-fw.fa-btn.fa-edit
        | &#32;
        | {{ subreddit.data.submit_text_label || "Submit a new link" }}
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/submit?selftext=true`'
      )
        i.fa.fa-fw.fa-btn.fa-edit
        | &#32;
        | {{ subreddit.data.submit_link_label || "Submit a new text post" }}
      b-nav-item(
        :to='{ path: "/pushshift/search/", query: { kind: "comment", subreddit: $route.params.subreddit } }'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Pushshift
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/moderators`'
      )
        i.fa.fa-fw.fa-btn.fa-shield
        | &#32;
        | Moderators
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/contributors`'
      )
        i.fa.fa-fw.fa-btn.fa-check
        | &#32;
        | Approved Users
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/wikicontributors`'
      )
        i.fa.fa-fw.fa-btn.fa-book
        | &#32;
        | WikiContributors Users
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/banned`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | Banned Users
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/muted`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | Muted Users
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/wikibanned`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | WikiBanned Users
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/log`'
      )
        i.fa.fa-fw.fa-btn.fa-th-list
        | &#32;
        | Mod Log
      b-nav-item(
        v-if="subreddit.data.user_is_moderator"
        rel="nofollow" target="_blank"
        :to='`/r/${$route.params.subreddit}/wiki/config/automoderator`'
      )
        i.fa.fa-fw.fa-btn.fa-external-link
        | &#32;
        | Automod Config
    .row.clearfix
      .col.order-md-1
        p.alert.alert-danger(v-if='subreddit.networkError')
          strong Network Error, subreddit might not exist
          br
          | Reddit apps are required to use OAuth and CORS.
          | When a subreddit does not exist,
          | the reddit website redirects the user to a subreddit
          | search page. Reddit did not configure their CORS setup
          | to allow the redirect. As a result, Nuxtit (this webapp)
          | only recieves an undetailed "Network Error". Reddit
          | needs to update their OAuth endpoints to return a JSON
          | 404 or update their CORS.
          br
          br
          nuxt-link.btn.btn-primary(
            :to='`/subreddits/search?q=${$route.params.subreddit}`'
          )
            i.fa.fa-search.fa-fw
            | Search for subreddits matching "{{ $route.params.subreddit }}"
        nuxt-child(v-else :subreddit='subreddit')
      .col.col-12.col-sm-12.col-md-4.col-lg-3.col-xl-3.order-md-12(
        v-if='showSideBar'
      )
        CommunityDetails(:subreddit='subreddit')
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
import { mapGetters } from 'vuex';

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
    ...mapGetters('auth', ['MeData']),
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
      subreddit: (await reddit
        .get(`/r/${subreddit}/about`, {
          params: {
            api_type: 'json',
          },
        })
        .catch(err => {
          // attempting to handle 404 subreddit DNE
          if (err.message === 'Network Error') {
            return {
              data: {
                ...makeVirtualSubreddit(subreddit),
                networkError: true,
              },
            };
            // console.error(err);
            // console.error(err.response); // undefined
            // console.error(err.config); // valid, but useless
            // console.error(err.request); // undefined
            // console.error(err.code); // undefined
            // console.error(err.message); // 'Network Error'
            // console.error(err.prototype); // undefined
          }

          throw err;
        })).data,
      // rules: (await reddit.get(`/r/${subreddit}/about/rules`)).data,
      // docs are wrong, DNE
      // sidebar: (await reddit.get(`/r/${subreddit}/sidebar`)).data,
      // returns empty data:
      // sidebar: (await reddit.get(`/r/${subreddit}/about/sidebar`)).data,
    };
  },
};
</script>
