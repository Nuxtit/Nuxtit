<template lang="pug">
  div
    .container.subreddit-banner(:style='subredditBannerStyles')
      br
      b-img.profile-icon-img(
        v-if="user.data.icon_img"
        :src="user.data.icon_img"
        thumbnail
        width="128"
        height="128"
      )
      br
      br
      br
    h2(style='')
      | /u/{{user.data.name}}
      .pull-right
        SelectUserPage(:user='user')
    .small
      a(
        :href='`https://www.reddit.com${$route.fullPath}`'
        target='_blank'
      )
        i.fa.fa-fw.fa-reddit
        span see on reddit
    hr
    nuxt-child(:user='user')
</template>

<script>
import first from 'lodash/first';
import bImg from 'bootstrap-vue/es/components/image/img';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
import SelectUserPage from '~/components/SelectUserPage';
export default {
  defaultSort: 'new',
  components: {
    bImg,
    PostList,
    RedditPagination,
    SelectUserPage,
  },
  async asyncData({ reddit, route }) {
    const { username } = route.params;
    return {
      user: (await reddit.get(`/user/${username}/about`)).data,
    };
  },
  computed: {
    subredditBannerStyles() {
      const { subreddit } = this.user.data;
      const banner_img = subreddit ? subreddit.banner_img : null;
      return {
        'background-image': banner_img
          ? `url("${subreddit.banner_img}")`
          : null,
      };
    },
  },
};
</script>

<style lang="sass">
.subreddit-banner
  background-size: contain;
  background-repeat: no-repeat;
  min-height: 1rem;
.profile-icon-img
  margin-left: 2rem;
</style>
