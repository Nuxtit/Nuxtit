<template lang="pug">
  b-select(
    name='is_self'
    :options='$options.selectOptions'
    v-model='is_self'
  )
</template>

<script>
import QueryParamIsSelf from '~/mixins/QueryParamIsSelf';

// pushshift accepts y and n
export default {
  name: 'SelectQueryIsSelf',
  mixins: [QueryParamIsSelf],
  selectOptions: Object.freeze([
    { value: null, text: 'Self+Non-Self Posts' },
    { value: 'y', text: 'Self Posts Only' },
    { value: 'n', text: 'Non-Self Posts Only' },
  ]),
};
</script>
