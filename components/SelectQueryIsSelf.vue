<template lang="pug">
  b-select(
    name='is_self'
    :options='$options.selectOptions'
    v-model='is_self'
  )
</template>

<script>
import QueryParamIsSelf from '~/mixins/QueryParamIsSelf';

export default {
  name: 'SelectQueryIsSelf',
  mixins: [QueryParamIsSelf],
  selectOptions: Object.freeze([
    { value: null, text: 'Self+Non-Self Posts' },
    { value: '1', text: 'Self Posts Only' },
    { value: '0', text: 'Non-Self Posts Only' },
  ]),
};
</script>
