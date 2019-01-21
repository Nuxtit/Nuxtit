<template lang="pug">
  .search-page
    .container
      .row
        .col
          SelectQueryKind()
        .col
          SelectQuerySubredditCsv()
      .row
        .col
          SearchInput(
            @update-search="fetchItems"
          )
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
    template(v-if='$route.query.q || !zeroResults')
      //- RedditPagination(
      //-   :collection='items'
      //-   :fetching='fetching'
      //- )
      MixedList(:items='items')
      //- RedditPagination(
      //-   v-if='showBottomPagination'
      //-   :collection='items'
      //-   :fetching='fetching'
      //- )
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
import MixedList from '~/components/MixedList.vue';
import PushshiftList from '~/components/PushshiftList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import PushshiftItems from '~/mixins/PushshiftItems';
import SearchInput from '~/components/SearchInput';
import SelectQueryKind from '~/components/SelectQueryKind';
import SelectQuerySubredditCsv from '~/components/SelectQuerySubredditCsv';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    MixedList,
    PushshiftList,
    RedditPagination,
    SearchInput,
    SelectQueryKind,
    SelectQuerySubredditCsv,
  },
  mixins: [
    PushshiftItems({
      //
    }),
    ValidatePostSort,
  ],
  mounted() {
    // console.log('searchpage');
  },
};
</script>
