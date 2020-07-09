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
          name='add_author'
          v-model='nextname'
          placeholder='author'
        )
      .col.row
        .col
          .btn.btn-success(@click.prevent.stop="subsList = [...subsList, nextname]; nextname = ''")
            i.fa.fa-fw.fa-plus
            | Add
          | &nbsp;
        .col
          b-form-checkbox(
            v-model="authornegated"
          ) exclude
    .row
      .col
        table.table.table-sm
          thead: tr
            th author
            th count
            th
          tbody
            tr(v-for="qr in quickRemovesFiltered" :key="qr.name")
              td
                tt.text-muted(v-if="!qr.name || qr.name[0] === '['" v-text="qr.name")
                a(v-else :to="`/user/${qr.name}`" v-text="qr.name")
              td(v-text="qr.count")
              td
                .btn.btn-sm.btn-success(@click.prevent.stop="subsList = [...subsList, qr.name]")
                  i.fa.fa-fw.fa-plus
                  | &nbsp;Add
  div(v-else)
    i.fa.fa-fw.fa-plus(@click.prevent.stop="expanded = true")
    | {{ authornegated ? 'Excluding' : 'Including' }}
    | Authors:
    span.badge.badge-secondary(v-text="subsList.slice(0, 5).join(', ') || 'None'")
    span.badge.badge-secondary(v-if="subsList.length > 5") ...{{ (subsList.length - 5) }} more
</template>

<script>
import QueryParamAuthorCsv from '~/mixins/QueryParamAuthorCsv';
import QueryParamAuthorNegated from '~/mixins/QueryParamAuthorNegated';
import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';

export default {
  name: 'SelectQueryAuthorCsv',
  mixins: [QueryParamAuthorCsv, QueryParamAuthorNegated],
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
        return (this.author || '')
          .split(',')
          .map(cleanupSubName)
          .filter(Boolean);
      },
      set(newValue) {
        newValue = (newValue || []).map(cleanupSubName);
        this.author = newValue.filter(Boolean).join(',');
      },
    },
    quickRemovesFiltered() {
      return sortBy(
        Object.values(this.quickRemoves).filter(
          qr => !includes(this.subsList, qr.name),
        ),
        ['name'],
      );
    },
  },
};

function cleanupSubName(name, negated) {
  name = name || '';
  name = name.trim();
  if (name[0] === '!') {
    name = name.substring(1);
  }
  return name.trim();
}
</script>

<style></style>
