<template lang="pug">
  b-badge(
    v-if='text'
    v-text='text'
  )
  span.no-flair(v-else)
</template>

<script>
import get from 'lodash/get';

// examples of gilded comments/posts
// @link https://www.reddit.com/user/PoglaTheGrate/gilded/
export default {
  name: 'GildedBadge',
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  computed: {
    text() {
      const { gildings } = this.item.data;
      if (gildings) {
        let text = '';
        if (this.item.data.gildings.gid_1 > 0) {
          if (text) text += ', ';
          text += `silver: ${gildings.gid_1}`;
        }
        if (this.item.data.gildings.gid_2 > 0) {
          if (text) text += ', ';
          text += `gold: ${gildings.gid_2}`;
        }
        if (this.item.data.gildings.gid_3 > 0) {
          if (text) text += ', ';
          text += `platinum: ${gildings.gid_3}`;
        }
        return text;
      }
    },
  },
};
</script>

<style lang="sass"></style>
