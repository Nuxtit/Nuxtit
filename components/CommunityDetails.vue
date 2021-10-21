<template lang="pug">
  .community-details
    h5.text-center Community Details
    hr
    h4 /r/{{subreddit.display_name}}
    ItemHtml(:value='subreddit.description_html')
    //- pre.text-monospace {{ {subreddit} }}
    //- pre.text-monospace {{ {sidebar} }}
    //- pre.text-monospace {{ {rules} }}
</template>
<script>
import ItemHtml from '~/components/ItemHtml';

export default {
  name: 'CommunityDetails',
  components: {
    ItemHtml,
  },
  props: {
    subreddit: {
      type: Object,
      required: true,
    },
  },
};
</script>
