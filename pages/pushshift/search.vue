<template lang="pug">
  .search-page
    .container
      .row
        .col
          SelectQueryKind()
        .col
          SelectQuerySize(:max="500")
      .row
        .col
          SelectQuerySubredditCsv()
      .row
        .col
          SelectQueryAuthorCsv()
      .row
        .col
          SelectQueryText(path="after" placeholder="after: 1{s,m,h,d}")
        .col
          SelectQueryText(path="before" placeholder="before: 1{s,m,h,d}")
      .row
        .col
          SearchInput(
            :busy="fetching"
            @update-search="fetchItems"
          )
          br
          p
            strong aaaa bbbb
            br
            span find items containing "aaaa" AND "bbbb"
            br
            strong aaaa | bbbb
            br
            span find items containing "aaaa" OR "bbbb"
            br
            strong cccc | (aaaa | bbbb)
            br
            span find items containing "aaaa" OR "bbbb", and always "cccc"
            br
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
    //- template(v-if='!$route.query.q')
    //-   br
    //-   .container
    //-     .alert.alert-primary
    //-       | Type in a query to start searching
    template(v-if='!zeroResults')
      .pull-right
        nuxt-link.btn.btn-pimary(
          v-if="lastCreatedAt"
          :to="$mergeRouteQuery({ before: lastCreatedAt + 1 })"
          @click.native="nextPage"
        ) next page
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
import SelectQuerySize from '~/components/SelectQuerySize';
import SelectQueryAuthorCsv from '~/components/SelectQueryAuthorCsv';
import SelectQueryText from '~/components/SelectQueryText';
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
    SelectQuerySize,
    SelectQueryText,
    SelectQueryAuthorCsv,
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
