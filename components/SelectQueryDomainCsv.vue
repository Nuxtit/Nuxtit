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
          name='add_domain'
          v-model='nextname'
          placeholder='domain'
        )
      .col.row
        .col
          .btn.btn-success(@click.prevent.stop="subsList = [...subsList, nextname]; nextname = ''")
            i.fa.fa-fw.fa-plus
            | Add
          | &nbsp;
        .col
          b-form-checkbox(
            v-model="domainnegated"
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
    | {{ domainnegated ? 'Excluding' : 'Including' }}
    | Domains:
    span.badge.badge-secondary(v-text="subsList.slice(0, 5).join(', ') || 'None'")
    span.badge.badge-secondary(v-if="subsList.length > 5") ...{{ (subsList.length - 5) }} more
</template>

<script>
import QueryParamDomainCsv from '~/mixins/QueryParamDomainCsv';
import QueryParamDomainNegated from '~/mixins/QueryParamDomainNegated';
import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';

export default {
  name: 'SelectQueryDomainCsv',
  mixins: [QueryParamDomainCsv, QueryParamDomainNegated],
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
        return (this.domain || '')
          .split(',')
          .map(cleanupSubName)
          .filter(Boolean);
      },
      set(newValue) {
        newValue = (newValue || []).map(cleanupSubName);
        this.domain = newValue.filter(Boolean).join(',');
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

<style></style>
