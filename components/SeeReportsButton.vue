<template lang="pug">
  span.btn-see-reports(v-show='item.data.num_reports > 0', @click.stop.prevent="$emit('click', $event)")
    i.fa.fa-fw.fa-btn.fa-code
    | see reports ({{ item.data.num_reports }})
</template>

<script>
// import * as reports from '~/lib/reports';

export default {
  name: 'SeeReportsButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // count() {
    //   console.log(reports.getCount(this.item));
    //   return reports.getCount(this.item);
    // },
  },
};
</script>
