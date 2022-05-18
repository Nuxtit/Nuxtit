<template lang="pug">
  div
    .row
      .col
        .container.subreddit-banner(:style='subredditBannerStyles')
          br
          BImg.profile-icon-img(
            v-if="subreddit.icon_img"
            :src="subreddit.icon_img"
            thumbnail
            width="128"
            height="128"
          )
          br
          br
          br
        h3(@click.prevent.stop="$write_clipboard(subreddit.display_name)")
          | /r/{{subreddit.display_name}}
        h4 {{subreddit.title}}
      .col
        table.table.table-sm(style="width: unset; min-width:256px" v-if="!subreddit.is_virtual")
          tbody
            tr
              th restrict_posting
              td(class="text-right") {{subreddit.restrict_posting}}
            tr(v-if="subreddit.user_is_muted")
              th user_is_muted
              td(class="text-right") {{subreddit.user_is_muted}}
            tr
              th active_user_count
              td(class="text-right") {{subreddit.active_user_count}}
            tr
              th accounts_active
              td(class="text-right") {{subreddit.accounts_active}}
            tr
              th subscribers
              td(class="text-right") {{subreddit.subscribers}}
            tr(v-if="subreddit.quarantine")
              th quarantine
              td(class="text-right") {{subreddit.quarantine}}
            tr(v-if="subreddit.hide_ads")
              th hide_ads
              td(class="text-right") {{subreddit.hide_ads}}
            tr(v-if="subreddit.emojis_enabled")
              th emojis_enabled
              td(class="text-right") {{subreddit.emojis_enabled}}
            tr(v-if="subreddit.advertiser_category")
              th advertiser_category
              td(class="text-right") {{subreddit.advertiser_category}}
            tr
              th should_archive_posts
              td(class="text-right") {{subreddit.should_archive_posts}}
            tr
              th is_crosspostable_subreddit
              td(class="text-right") {{subreddit.is_crosspostable_subreddit}}
            tr
              th subreddit_type
              td(class="text-right") {{subreddit.subreddit_type}}
            tr(v-if="subreddit.over18")
              th over18
              td(class="text-right") {{subreddit.over18}}
            tr
              th lang
              td(class="text-right") {{subreddit.lang}}
    p(v-if='subreddit.name')
      SubscribeButton(
        :item='subreddit'
      )
      | &#32;
      a(:href="`https://old.reddit.com/r/${subreddit.display_name}`" target="_blank")
        i.fa.fa-fw.fa-btn.fa-reddit
        | &#32;
        span.small see on reddit
      | &#32;
      TimeAgo(:value='subreddit.created_utc')
      | &#32;
      span.btn-see-source(
        @click.prevent.stop='showSource^=true'
      )
        i.fa.fa-fw.fa-btn.fa-code
        | &#32;source
    p(v-if='subreddit.name')
      | Your flair on this sub looks like:
      | &#32;
      UserLink(:username='MeData.name')
      | &#32;
      FlairBadge(
        :item='subreddit'
        type='user'
        show-none
      )
    pre.small.text-monospace(v-if='showSource' v-text="subreddit")
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
        | {{ subreddit.submit_text_label || "Submit a new link" }}
      b-nav-item(
        :to='`/r/${$route.params.subreddit}/submit?selftext=true`'
      )
        i.fa.fa-fw.fa-btn.fa-edit
        | &#32;
        | {{ subreddit.submit_link_label || "Submit a new text post" }}
      b-nav-item(
        :to='{ path: "/pushshift/search/", query: { kind: "comment", subreddit: $route.params.subreddit } }'
      )
        i.fa.fa-fw.fa-btn.fa-list
        | &#32;
        | Pushshift
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/moderators`'
      )
        i.fa.fa-fw.fa-btn.fa-shield
        | &#32;
        | Moderators
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/contributors`'
      )
        i.fa.fa-fw.fa-btn.fa-check
        | &#32;
        | Approved Users
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/wikicontributors`'
      )
        i.fa.fa-fw.fa-btn.fa-book
        | &#32;
        | WikiContributors Users
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/banned`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | Banned Users
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/muted`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | Muted Users
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/wikibanned`'
      )
        i.fa.fa-fw.fa-btn.fa-block
        | &#32;
        | WikiBanned Users
      b-nav-item(
        v-if="subreddit.user_is_moderator"
        :to='`/r/${$route.params.subreddit}/about/log`'
      )
        i.fa.fa-fw.fa-btn.fa-th-list
        | &#32;
        | Mod Log
      b-nav-item(
        v-if="subreddit.user_is_moderator"
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
import CommunityDetails from '~/components/CommunityDetails';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import FlairBadge from '~/components/FlairBadge';
import TimeAgo from '~/components/TimeAgo';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import SubscribeButton from '~/components/SubscribeButton.vue';
import UserLink from '~/components/UserLink';
import RedditItems from '~/mixins/RedditItems';
import {BImg} from 'bootstrap-vue/esm/components/image/img';
import { isVirtualSubreddit, makeVirtualSubreddit } from '~/lib/subreddit';
import { makeComputeToggler } from '~/lib/toggle_open';
import { mapGetters } from 'vuex';
import undata from '~/lib/undata';

export default {
  middleware: ['auth'],
  defaultSort: 'hot',
  components: {
    BImg,
    CommunityDetails,
    FlairBadge,
    TimeAgo,
    PostList,
    RedditPagination,
    SubscribeButton,
    UserLink,
  },
  head() {
    let title = this.$route.params.subreddit;
    if (this.subreddit && this.subreddit.display_name) {
      title = `r/${this.subreddit.display_name}`;
    }
    return {
      title,
    };
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
      const subreddit = this.subreddit;
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
    const subredditData = (await reddit
      .get(`/r/${subreddit}/about`, {
        params: {
          api_type: 'json',
        },
      })
      .catch(err => {
        // attempting to handle 404 subreddit DNE
        if (err.message === 'Network Error') {
          return {
            ...makeVirtualSubreddit(subreddit),
            networkError: true,
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
      })).data;
    return {
      subreddit: undata(subredditData),
      // rules: (await reddit.get(`/r/${subreddit}/about/rules`)).data,
      // docs are wrong, DNE
      // sidebar: (await reddit.get(`/r/${subreddit}/sidebar`)).data,
      // returns empty data:
      // sidebar: (await reddit.get(`/r/${subreddit}/about/sidebar`)).data,
    };
  },
};
</script>
