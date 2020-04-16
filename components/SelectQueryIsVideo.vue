<template lang="pug">
  b-select(
    name='is_video'
    :options='$options.selectOptions'
    v-model='is_video'
  )
</template>

<script>
import QueryParamIsVideo from '~/mixins/QueryParamIsVideo';

export default {
  name: 'SelectQueryIsVideo',
  mixins: [QueryParamIsVideo],
  selectOptions: Object.freeze([
    { value: null, text: 'Video+Non-Video Posts' },
    { value: '1', text: 'Video Posts Only' },
    { value: '0', text: 'Non-Video Posts Only' },
  ]),
};
</script>
