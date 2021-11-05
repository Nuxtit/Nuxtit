<template lang="pug">
  b-badge(
    v-if="isApproved"
    variant='success'
  )
    | approved
    template(v-if="item.removal_reason") : {{item.removal_reason}}
    | &#32;
    template(v-if="item.approved_by")
      | [by
      | &#32;
      UserLink.text-white(:username='item.approved_by')
      | ]
    template(v-if="item.mod_reason_by")
      | by
      | &#32;
      UserLink.text-white(:username='item.mod_reason_by')
    | &#32;
    template(v-if="item.ban_note")  [ban_note={{item.ban_note}}]
    | &#32;
    TimeAgo.small(v-if="item.approved_at_utc" :value="item.approved_at_utc")
  span(v-else v-show="false")
</template>

<script>
import ApproveButton from '~/components/ApproveButton';
import TimeAgo from '~/components/TimeAgo';
import UserLink from '~/components/UserLink';

export default {
  name: 'ApprovedBadge',
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
    isApproved: ApproveButton.computed.isApproved,
  },
};
</script>

<style lang="sass"></style>
