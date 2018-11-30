<template lang="pug">
  .search-page
    .container
      .row
        .col
          SearchInput()
        .col
          p
            strong subreddit:<em>subreddit</em>
            br
            span find submissions in "subreddit"
            br
            strong author:<em>username</em>
            br
            span find submissions by "username"
            br
            strong site:<em>example.com</em>
            br
            span find submissions from "example.com"
            br
            strong url:<em>text</em>
            br
            span search for "text" in url
            br
            strong selftext:<em>text</em>
            br
            span search for "text" in self post contents
            br
            strong self:yes (or self:no)
            br
            span include (or exclude) self posts
            br
            strong nsfw:yes (or nsfw:no)
            br
            span include (or exclude) results marked as NSFW
    template(v-if='$route.query.q')
      RedditPagination(
        :collection='items'
        :fetching='fetching'
      )
      PostList(:posts='items')
      RedditPagination(
        v-if='showBottomPagination'
        :collection='items'
        :fetching='fetching'
      )
    template(v-if='!$route.query.q')
      br
      .container
        .alert.alert-primary
          | Type in a query to start searching
    template(v-if='$route.query.q && zeroResults')
      br
      .container
        .alert.alert-info
          | Zero Results
</template>

<script>
import ValidatePostSort from '~/mixins/ValidatePostSort';
import PostList from '~/components/PostList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import RedditItems from '~/mixins/RedditItems';
import SearchInput from '~/components/SearchInput';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    PostList,
    RedditPagination,
    SearchInput,
  },
  mixins: [
    RedditItems({
      shouldAttemptApi({ route }) {
        return !!route.query.q;
      },
      path({ route }) {
        const subreddit = route.query.subreddit || route.params.subreddit;
        if (subreddit) {
          return `/r/${subreddit}/search`;
        }
        return '/search/';
      },
      query({ route }) {
        return {
          sort: 'new',
          ...route.query,
          // include_facets: ?
        };
      },
    }),
    ValidatePostSort,
  ],
  mounted() {
    console.log('searchpage');
  },
};
</script>
