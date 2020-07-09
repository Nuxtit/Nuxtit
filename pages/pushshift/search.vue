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
        .col(v-if="$route.query.kind === 'post'")
          SelectQueryPostGroupBy()
        .col(v-if="$route.query.kind === 'comment'")
          SelectQueryCommentGroupBy()
      .row
        .col
          SelectQuerySubredditCsv(:quick-removes="pluckquickremoves('subreddit')")
      .row
        .col
          SelectQueryAuthorCsv(:quick-removes="pluckquickremoves('author')")
      .row(v-if="$route.query.kind === 'post'")
        .col
          SelectQueryDomainCsv(:quick-removes="pluckquickremoves('domain')")
      .row
        .col
          SelectQueryText(path="after" placeholder="after: 1{s,m,h,d}")
        .col
          SelectQueryText(path="before" placeholder="before: 1{s,m,h,d}")
      .row(v-if='$route.query.kind === "post" || $route.query.parent_id')
        .col
          SelectQueryText(path="parent_id" placeholder="parent_id")
      .row(v-if='$route.query.kind === "comment" || $route.query.link_id')
        .col
          SelectQueryText(path="link_id" placeholder="link_id")
      .row
        .col
          SelectQueryText(path="q" placeholder="query")
      .row
        .col
          SelectQueryIsVideo
        .col
          SelectQueryIsSelf
      .row
        .col
          b-button.my-2.my-sm-0(
            :disabled="saveDisabled"
            size='sm'
            type='submit'
            @click.prevent.stop="saveSearch"
          )
            i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if="saving")
            i.fa.fa-fw.fa-btn.fa-floppy(v-if="!saving")
            | &#32;
            | Save
        .col
          b-button.my-2.my-sm-0(
            :disabled="removeDisabled"
            size='sm'
            type='button'
            @click.prevent.stop="removeSearch"
          )
            i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if="removing")
            i.fa.fa-fw.fa-btn.fa-floppy(v-if="!removing")
            | &#32;
            | Remove
      .row
        .col
          b-form-input(
            name="name",
            v-model="name",
            placeholder="type in a name to save search"
          )
        .col
          b-select(name="saved_search" v-model="selectedSearch", :options="savedSearchOptions")
      .row
        .col
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
    .container
      template(v-if='$route.query.q || !zeroResults')
        //- RedditPagination(
        //-   :collection='items'
        //-   :fetching='fetching'
        //- )
        PostsGroupedByLinks(
          v-if='$route.query.kind === "post" && $route.query.post_group_by === "link_url"'
          :items='items'
        )
        CommentsGroupedByLinks(
          v-else-if='$route.query.kind === "comment" && $route.query.comment_group_by === "link_id"'
          :items='items'
        )
        MixedList(
          v-else
          :items='items'
        )
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
import QueryParamSavedsearchname from '~/mixins/QueryParamSavedsearchname';
import ValidatePostSort from '~/mixins/ValidatePostSort';
import MixedList from '~/components/MixedList.vue';
import PushshiftList from '~/components/PushshiftList.vue';
import RedditPagination from '~/components/RedditPagination.vue';
import CommentsGroupedByLinks from '~/components/CommentsGroupedByLinks';
import PostsGroupedByLinks from '~/components/PostsGroupedByLinks';
import PushshiftItems from '~/mixins/PushshiftItems';
import SearchInput from '~/components/SearchInput';
import SelectQueryCommentGroupBy from '~/components/SelectQueryCommentGroupBy';
import SelectQueryDomainCsv from '~/components/SelectQueryDomainCsv';
import SelectQueryPostGroupBy from '~/components/SelectQueryPostGroupBy';
import SelectQueryKind from '~/components/SelectQueryKind';
import SelectQueryIsVideo from '~/components/SelectQueryIsVideo';
import SelectQueryIsSelf from '~/components/SelectQueryIsSelf';
import SelectQuerySize from '~/components/SelectQuerySize';
import SelectQueryAuthorCsv from '~/components/SelectQueryAuthorCsv';
import SelectQueryText from '~/components/SelectQueryText';
import SelectQuerySubredditCsv from '~/components/SelectQuerySubredditCsv';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { startMinWait } from '~/lib/sleep';
import { mapGetters } from 'vuex';

export default {
  middleware: ['auth'],
  defaultSort: 'new',
  components: {
    bButton,
    MixedList,
    PushshiftList,
    RedditPagination,
    SearchInput,
    CommentsGroupedByLinks,
    PostsGroupedByLinks,
    SelectQueryCommentGroupBy,
    SelectQueryDomainCsv,
    SelectQueryPostGroupBy,
    SelectQueryKind,
    SelectQueryIsVideo,
    SelectQueryIsSelf,
    SelectQuerySize,
    SelectQueryText,
    SelectQueryAuthorCsv,
    SelectQuerySubredditCsv,
  },
  mixins: [
    QueryParamSavedsearchname,
    PushshiftItems({
      //
    }),
    ValidatePostSort,
  ],
  data() {
    return {
      saving: false,
      removing: false,
    };
  },
  computed: {
    ...mapGetters('searches', ['list']),
    saveDisabled() {
      if (this.saving || !this.name) {
        return true;
      }
      // @todo disable if same
      return false;
    },
    removeDisabled() {
      if (this.removing || !this.name) {
        return true;
      }
      // @todo disable if same
      return false;
    },
    savedSearchOptions() {
      return Object.keys(this.list);
    },
    selectedSearch: {
      get() {
        return get(get(this.list, this.name, null), 'name');
      },
      set(value) {
        const next = get(this.list, value);
        if (next) {
          this.name = next.name;
          this.$router.push(
            JSON.parse(
              JSON.stringify({
                path: this.$route.path,
                query: {
                  ...next,
                },
              }),
            ),
          );
        }
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.kind) {
      to.query.kind = 'post';
    }
    next();
  },
  mounted() {
    // console.log('searchpage');
  },
  methods: {
    pluckquickremoves(path) {
      return reduce(
        get(this.items, 'data.children'),
        (carry, item) => {
          const name = get(item, `pushshiftEntry.${path}`);
          if (name) {
            if (!carry[name]) {
              carry[name] = {
                name,
                count: 0,
              };
            }
            carry[name].count++;
          }
          return carry;
        },
        {},
      );
    },
    async saveSearch() {
      if (this.name) {
        const minWait = startMinWait();
        try {
          this.saving = true;
          await this.$store.dispatch('searches/set', this.$route.query);
        } finally {
          await minWait;
          this.saving = false;
        }
      }
    },
    async removeSearch() {
      if (this.name) {
        const minWait = startMinWait();
        try {
          this.removing = true;
          await this.$store.dispatch('searches/remove', this.name);
        } finally {
          await minWait;
          this.removing = false;
        }
      }
    },
  },
};
</script>
