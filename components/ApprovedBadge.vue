<template lang="pug">
  b-badge(
    v-if="isApproved"
    variant='success'
  )
    | approved
    template(v-if="item.data.removal_reason") : {{item.data.removal_reason}}
    | &#32;
    template(v-if="item.data.approved_by")
      | [by
      | &#32;
      UserLink.text-white(:username='item.data.approved_by')
      | ]
    template(v-if="item.data.mod_reason_by")
      | by
      | &#32;
      UserLink.text-white(:username='item.data.mod_reason_by')
    | &#32;
    template(v-if="item.data.ban_note")  [{{item.data.ban_note}}]
    | &#32;
    TimeAgo.small(v-if="item.data.approved_at_utc" :value="item.data.approved_at_utc")
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

<style lang="sass">
</style>
