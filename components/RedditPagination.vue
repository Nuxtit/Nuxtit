<template lang="pug">
  .pagination-controls
    nuxt-link.before.btn.btn-secondary(
      v-disabled='fetching || !before'
      :to='$mergeRouteQuery({ before, after: void 0, count: (count - limit) || void 0 })'
    )
      i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='fetching')
      i.fa.fa-fw.fa-btn.fa-left-open(v-else)
      | &#32;
      | prev
    nuxt-link.after.btn.btn-secondary(
      v-disabled='fetching || !after'
      :to='$mergeRouteQuery({ after, before: void 0, count: count + limit })'
    )
      | next
      | &#32;
      i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='fetching')
      i.fa.fa-fw.fa-btn.fa-right-open(v-else)
    SelectQueryLimit.select-limit(
      v-disabled='fetching'
    )
    SelectRedditSort.select-sort(
      v-disabled='fetching'
    )
</template>

<script>
import find from 'lodash/find';
import findLast from 'lodash/findLast';
import get from 'lodash/get';
import QueryParamCount from '~/mixins/QueryParamCount';
import QueryParamLimit from '~/mixins/QueryParamLimit';
import SelectQueryLimit from '~/components/SelectQueryLimit';
import SelectRedditSort from '~/components/SelectRedditSort';

function get_name(item) {
  if (item) {
    if (item.data && item.data.name) {
      return item.data.name;
    }
    if (item.name) {
      return item.name;
    }
  }
  return null;
}

export default {
  name: 'RedditPagination',
  components: {
    SelectQueryLimit,
    SelectRedditSort,
  },
  mixins: [QueryParamCount, QueryParamLimit],
  props: {
    fetching: {
      type: Boolean,
      default: false,
    },
    collection: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lastId() {
      return get_name(
        findLast(get(this, 'collection.data.children'), get_name),
      );
    },
    firstId() {
      return get_name(find(get(this, 'collection.data.children'), get_name));
    },
    after() {
      const { collection, $route, lastId, count } = this;
      if (get(collection, 'data.after')) {
        return collection.data.after;
      }
      // if (lastId) {
      //   if ($route.query.before || count === 0) {
      //     return lastId;
      //   }
      // }
      if ($route.query.before) {
        return $route.query.before;
      }
      return null;
    },
    before() {
      const { collection, $route, firstId, count } = this;
      if (get(collection, 'data.before')) {
        return collection.data.before;
      }
      if (firstId) {
        if ($route.query.after || count > 0) {
          return firstId;
        }
      }
      if ($route.query.after) {
        return $route.query.after;
      }
      return null;
    },
  },
};
</script>

<style lang="sass">
.pagination-controls
  margin: 0.25rem;
  .btn + .btn
    margin-left: 0.25rem;

  .select-limit
    margin-left: 0.25rem;
    max-width: 4.3rem;

  .select-sort
    margin-left: 0.25rem;
    max-width: 9rem;
</style>
