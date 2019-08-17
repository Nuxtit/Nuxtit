<template lang="pug">
  span.btn-remove(
    v-disabled="busy || isRemoved"
    :class='classes'
    @click.stop.prevent="remove"
  )
    i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='busy')
    i.fa.fa-fw.fa-btn.fa-cancel(v-else)
    span(v-if='busy && isRemoved') unremoving
    span(v-else-if='busy && !isRemoved') removing
    span(v-else-if='isRemoved') removed
    span(v-else) remove
</template>

<script>
import { startMinWait } from '~/lib/sleep';

// remove is the moderator action of removing an item from public visibility

export default {
  name: 'RemoveButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      busy: false,
      error: null,
    };
  },
  computed: {
    isRemoved() {
      if (this.item.data.removed) {
        return true;
      }
      if (!this.item.data.approved) {
        // @link https://old.reddit.com/r/bugs/comments/ak741x/when_automoderator_removes_a_comment_in_the_api/?
        if (this.item.data.banned_by) {
          return true;
        }
      }
      return false;
    },
    classes() {
      return {
        'text-success': this.isRemoved,
      };
    },
  },
  methods: {
    async remove($event) {
      const { removed, name, subreddit } = this.item.data;
      const minWait = startMinWait();
      try {
        this.busy = true;
        const response = await this.$reddit.post(`/api/remove`, {
          // api_type: 'json',
          // spam: false,
          // r: subreddit,
          // executed: 'removed',
          id: name, // fullname

          executed: 'removed',
          spam: 'False',
          r: subreddit,
          // uh: eahqitwrtvc64410d588440459119b1292e96a061d7aed78d5
          // renderstyle: 'html',
          renderstyle: 'json',
        });
        this.item.data.removed = true;
        if (this.item.data.approved) {
          this.item.data.approved = false;
        }
        if (this.item.data.spam) {
          this.item.data.spam = false;
        }
        if (this.item.data.approved_by) {
          this.item.data.approved_by = null;
        }
        if (this.item.data.approved_at_utc) {
          this.item.data.approved_at_utc = null;
        }
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        await minWait;
        this.busy = false;
      }
    },
  },
};
</script>

<style lang="sass">
.btn-remove
  cursor: pointer
</style>
