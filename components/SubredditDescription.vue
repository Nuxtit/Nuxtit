<template lang="pug">
  .community-details
    h5.text-center Community Details
    hr
    h4 /r/{{subreddit.data.display_name}}
    ItemHtml(:value='subreddit.data.description_html')
    //- pre: tt {{ {subreddit} }}
    //- pre: tt {{ {sidebar} }}
    //- pre: tt {{ {rules} }}
</template>

<script>
import ItemHtml from '~/components/ItemHtml';

// the description_html string contains the sidebar,
// and rules, but is not the same as "Community Details"
export default {
  name: 'SubredditDescription',
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
