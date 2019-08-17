<template lang="pug">
  div(v-if="expanded")
    i.fa.fa-fw.fa-minus(@click.prevent.stop="expanded = false")
    div(v-for="name in subsList")
      i.fa.fa-fw.fa-cancel(@click.prevent.stop="subsList = subsList.filter(n => n !== name)")
      | &nbsp;
      span.badge.badge-secondary(v-text="name")
    .row
      .col
        b-form-input(
          name='add_subreddit'
          v-model='nextname'
          placeholder='subreddit'
        )
      .col.row
        .col
          .btn.btn-success(@click.prevent.stop="subsList = [...subsList, nextname]; nextname = ''")
            i.fa.fa-fw.fa-plus
            | Add
          | &nbsp;
        .col
          b-form-checkbox(
            v-model="subredditnegated"
          ) exclude
    .row
      .col
        div(v-for="qr in quickRemovesFiltered")
          .btn.btn-sm.btn-success(@click.prevent.stop="subsList = [...subsList, qr.name]")
            i.fa.fa-fw.fa-plus
            | Add&nbsp;
            tt {{ qr.name }}
            | &nbsp;({{ qr.count }})
  div(v-else)
    i.fa.fa-fw.fa-plus(@click.prevent.stop="expanded = true")
    | {{ subredditnegated ? 'Excluding' : 'Including' }}
    | Subs:
    span.badge.badge-secondary(v-text="subsList.slice(0, 5).join(', ') || 'None'")
    span.badge.badge-secondary(v-if="subsList.length > 5") ...{{ (subsList.length - 5) }} more
</template>

<script>
import QueryParamSubredditCsv from '~/mixins/QueryParamSubredditCsv';
import QueryParamSubredditNegated from '~/mixins/QueryParamSubredditNegated';
import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';

export default {
  name: 'SelectQuerySubredditCsv',
  mixins: [QueryParamSubredditCsv, QueryParamSubredditNegated],
  props: {
    quickRemoves: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      expanded: false,
      nextname: '',
    };
  },
  computed: {
    subsList: {
      get() {
        return (this.subreddit || '')
          .split(',')
          .map(cleanupSubName)
          .filter(Boolean);
      },
      set(newValue) {
        newValue = (newValue || []).map(cleanupSubName);
        this.subreddit = newValue.filter(Boolean).join(',');
      },
    },
    quickRemovesFiltered() {
      return sortBy(
        Object.values(this.quickRemoves).filter(
          qr => !includes(this.subsList, qr.name),
        ),
        'name',
      );
    },
  },
};

function cleanupSubName(name, negated) {
  name = name || '';
  if (name[0] === '!') {
    name = name.substring(1);
  }
  return name.trim();
}
</script>

<style>
</style>
