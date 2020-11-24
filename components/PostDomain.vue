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
      const domain_length = domain.length;
      const index_of_qm = url.indexOf('?');
      const url_no_qm =
        index_of_qm !== -1 ? url.substring(0, index_of_qm) : url;
      if (
        domain === 'old.reddit.com' ||
        domain === 'reddit.com' ||
        domain === 'np.reddit.com' ||
        domain === 'new.reddit.com'
      ) {
        const index_of_domain = url_no_qm.indexOf(domain);
        const index_of_gallery = url_no_qm.indexOf(
          '/gallery/',
          index_of_domain,
        );
        if (index_of_gallery !== -1) {
          return 'reddit.com/gallery';
        }

        const index_of_r = url_no_qm.indexOf(
          '/r/',
          index_of_domain + domain_length,
        );
        if (index_of_r !== -1) {
          const index_of_slash_after_r = url_no_qm.indexOf('/', index_of_r + 3);
          return url_no_qm.substring(index_of_r, index_of_slash_after_r);
        }
      }
      // if (domain === 'youtube.com') {
      //   // @todo if link to channel
      // }
      if (
        domain === 'twitter.com' ||
        domain === 'mobile.twitter.com' ||
        domain === 'm.twitter.com'
      ) {
        const index_of_status = url_no_qm.indexOf('/status/');
        const index_of_domain = url_no_qm.indexOf(domain);
        if (index_of_status !== -1) {
          return url_no_qm.substring(index_of_domain, index_of_status);
        }
        const after_domain_length =
          url_no_qm.length - (domain_length + index_of_domain + 1);
        if (after_domain_length > 1 && after_domain_length < 32) {
          return url_no_qm.substring(index_of_domain);
        }
      } else if (domain === 'imgur.com') {
        const index_of_a = url_no_qm.indexOf('/a/');
        if (index_of_a !== -1) {
          const index_of_domain = url_no_qm.indexOf(domain);
          return `${domain}/a`;
        }
        const index_of_r = url_no_qm.indexOf('/r/');
        if (index_of_r !== -1) {
          const index_of_domain = url_no_qm.indexOf(domain);
          return url_no_qm.substring(
            index_of_domain,
            url_no_qm.indexOf('/', index_of_domain + domain_length + 3),
          );
        }
        const index_of_gallery = url_no_qm.indexOf('/gallery/');
        if (index_of_gallery !== -1) {
          const index_of_domain = url_no_qm.indexOf(domain);
          return `${domain}/gallery`;
        }
      } else if (
        domain === 'medium.com' ||
        domain === 'soundcloud.com' ||
        domain === 'anchor.fm' ||
        domain === 'twitch.tv' ||
        domain === 'tiktok.com' ||
        domain === 'google.com' ||
        domain === 'facebook.com' ||
        domain === 'instagram.com'
      ) {
        const index_of_domain = url_no_qm.indexOf(domain);
        const index_of_slash = url_no_qm.indexOf(
          '/',
          index_of_domain + domain_length + 1,
        );
        if (index_of_slash !== -1 && index_of_slash > 3) {
          return url_no_qm.substring(index_of_domain, index_of_slash);
        }
        const after_domain_length =
          url_no_qm.length - (domain_length + index_of_domain + 1);
        if (
          index_of_slash === -1 &&
          after_domain_length > 1 &&
          after_domain_length < 48
        ) {
          return url_no_qm.substring(index_of_domain);
        }
      } else if (domain === 'github.com' || domain === 'gitlab.com') {
        const index_of_domain = url_no_qm.indexOf(domain);
        const index_of_slash_1 = url_no_qm.indexOf(
          '/',
          index_of_domain + domain_length + 1,
        );
        const index_of_slash_2 = url_no_qm.indexOf('/', index_of_slash_1 + 1);
        const after_domain_length =
          url_no_qm.length - (domain_length + index_of_domain + 1);
        const after_slash_1_length = url_no_qm.length - (index_of_slash_1 + 1);
        const index_of_qm = url_no_qm.indexOf('?');
        if (index_of_slash_2 !== -1) {
          return url_no_qm.substring(index_of_domain, index_of_slash_2);
        }
        if (after_slash_1_length > 1) {
          return url_no_qm.substring(index_of_domain);
        }
        if (index_of_slash_1 !== -1) {
          return url_no_qm.substring(index_of_domain, index_of_slash_1);
        }
        if (after_domain_length > 1) {
          return url_no_qm.substring(index_of_domain);
        }
      }
      // @todo google.com/amp
      // default
      return this.post.data.domain;
    },
  },
};
</script>
