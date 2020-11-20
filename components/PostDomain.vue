<template lang="pug">
  span.small.text-monospace(
    v-if='post.data.domain'
    v-text='`(${text})`'
  )
</template>

<script>
export default {
  name: 'PostDomain',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // if we go back to this being a link, then
    // to() {
    //   return this.post.data.is_self ? `/r/${this.post.data.domain.replace('self.')}` : `/domain/${this.post.data.domain}`;
    // },
    text() {
      if (this.post.data.is_self) {
        return this.post.data.domain;
      }
      const { url, domain } = this.post.data;
      if (
        domain === 'old.reddit.com' ||
        domain === 'reddit.com' ||
        domain === 'new.reddit.com'
      ) {
        const index_of_gallery = url.indexOf('reddit.com/gallery/');
        if (index_of_gallery !== -1) {
          return 'reddit.com/gallery';
        }

        const index_of_r = url.indexOf('/r/');
        if (index_of_r !== -1) {
          const index_of_slash_after_r = url.indexOf('/', index_of_r);
          return url.substring(
            index_of_r,
            index_of_r + index_of_slash_after_r - 1,
          );
        }
      }
      // if (domain === 'youtube.com') {
      //   // @todo if link to channel
      // }
      if (domain === 'twitter.com') {
        const index_of_status = url.indexOf('/status/');
        if (index_of_status !== -1) {
          const index_of_twitter = url.indexOf('twitter.com/');
          return url.substring(index_of_twitter, index_of_status);
        }
      }
      if (domain === 'medium.com') {
        const index_of_medium = url.indexOf('medium.com/');
        const index_of_slash = url.indexOf('/', index_of_medium + 11);
        if (index_of_slash !== -1 && index_of_slash > 3) {
          return url.substring(index_of_medium, index_of_slash);
        }
      }
      if (domain === 'soundcloud.com') {
        const index_of_soundcloud = url.indexOf('soundcloud.com/');
        const index_of_slash = url.indexOf('/', index_of_soundcloud + 15);
        if (index_of_slash !== -1 && index_of_slash > 3) {
          return url.substring(index_of_soundcloud, index_of_slash);
        }
      }
      // default
      return this.post.data.domain;
    },
  },
};
</script>
