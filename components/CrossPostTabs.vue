<template lang="pug">
  b-tabs(lazy content-class="mt-3")
    b-tab(title="CrossPost")
      .alert.alert-secondary.small
        | Note: You can submit a new post, but currently Nuxtit does not support reddit's crosspost parent feature, so it will lack the "crossposted from X" metadata.
      PostForm(
        :parent='parent'
        @created-post='onCrossPostCreated'
        @close="$emit('close')"
      )
    b-tab(title="Tumblr")
      .alert.alert-secondary.small
        nuxt-link(to="/nuxtit/settings/tumblr") tumblr settings
      TumblrShareForm(
        :parent='parent'
        @created-post='onTumblrShareCreated'
        @close="$emit('close')"
      )
    b-tab(title="Custom")
      .alert.alert-secondary.small
        | Coming soon...
</template>

<script>
import PostForm from '~/components/PostForm';
import TumblrShareForm from '~/components/TumblrShareForm';

export default {
  name: 'CrossPostTabs',
  components: {
    PostForm,
    TumblrShareForm,
  },
  props: {
    // only needed for crosspost
    parent: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
  methods: {
    onCrossPostCreated(newCrossPost) {
      // @todo
    },
    onTumblrShareCreated(newTumblrShare) {
      // @todo
    },
  },
};
</script>
