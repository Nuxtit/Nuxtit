<template lang="pug">
  .community-details
    h5.text-center Community Details
    p
      .d-block.d-sm-none xs
      .d-none.d-sm-block.d-md-none sm
      .d-none.d-md-block.d-lg-none md
      .d-none.d-lg-block.d-xl-none lg
      .d-none.d-xl-block xl
    hr
    h4 /r/{{subreddit.data.display_name}}
    ItemHtml(:value='subreddit.data.description_html')
    p details
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
