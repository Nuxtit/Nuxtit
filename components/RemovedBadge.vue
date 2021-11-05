<template lang="pug">
  b-badge(
    v-if="isRemoved"
    variant='danger'
  )
    | removed
    template(v-if="item.removal_reason") : {{item.removal_reason}}
    | &#32;
    template(v-if="item.banned_by && item.banned_by !== true")
      | [by
      | &#32;
      UserLink.text-white(:username='item.banned_by')
      | ]
    template(v-if="item.mod_reason_by && item.mod_reason_by !== true")
      | by
      | &#32;
      UserLink.text-white(:username='item.mod_reason_by')
    | &#32;
    template(v-if="item.ban_note")  [ban_note={{item.ban_note}}]
    | &#32;
    TimeAgo.small(v-if="item.banned_at_utc" :value="item.banned_at_utc")
  span(v-else v-show="false")
</template>

<script>
import RemoveButton from '~/components/RemoveButton';
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';

export default {
  name: 'RemoveBadge',
  components: {
    TimeAgo,
    UserLink,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isRemoved: RemoveButton.computed.isRemoved,
  },
};
</script>

<style lang="sass"></style>
