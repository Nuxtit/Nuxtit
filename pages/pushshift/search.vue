<template lang="pug">
  .search-page
    .container(
      @keyup.enter.prevent.stop="fetchItems"
    )
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
          SelectQueryText(path="q" placeholder="query")
          b-button.my-2.my-sm-0(
            :disabled="fetching"
            size='sm'
            type='submit'
            @click.prevent.stop="fetchItems"
          )
            i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if="fetching")
            i.fa.fa-fw.fa-btn.fa-search(v-if="!fetching")
            | &#32;
            | Search
          br
          p.small
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
            strong cccc | (aaaa | bbbb) -dddd
            br
            span find items containing "aaaa" OR "bbbb", and always "cccc", and will exclude any result containing "dddd"
            br
            strong cccc | (aaaa | bbbb) -dddd -eeee*
            br
            span same as above, but will exclude matches containing "eeee" and exclude matches that contain a match for the wildcard phrase "eeee*"
            br
    .container
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
import bButton from 'bootstrap-vue/es/components/button/button';
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
    bButton,
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
