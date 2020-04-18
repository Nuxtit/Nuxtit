<template lang="pug">
  .alert.alert-danger
    ShowSource(:value="data")
</template>

<script>
import * as reports from '~/lib/reports';

export default {
  name: 'ShowReports',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    data() {
      return reports.getData(this.item);
    },
  },
};
</script>
