<template lang="pug">
  b-select(
    name='is_video'
    :options='$options.selectOptions'
    v-model='is_video'
  )
</template>

<script>
import QueryParamIsVideo from '~/mixins/QueryParamIsVideo';

// pushshift accepts y and n
export default {
  name: 'SelectQueryIsVideo',
  mixins: [QueryParamIsVideo],
  selectOptions: Object.freeze([
    { value: null, text: 'Video+Non-Video Posts' },
    { value: 'y', text: 'Video Posts Only' },
    { value: 'n', text: 'Non-Video Posts Only' },
  ]),
};
</script>
