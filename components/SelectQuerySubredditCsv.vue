<template lang="pug">
  div
    b-form-input(
      name='subreddit'
      v-model='subreddit'
    )
</template>

<script>
import QueryParamSubredditCsv from '~/mixins/QueryParamSubredditCsv';

export default {
  name: 'SelectQuerySubredditCsv',
  mixins: [QueryParamSubredditCsv],
};
</script>

<style>
</style>
