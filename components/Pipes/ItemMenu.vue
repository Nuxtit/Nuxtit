<template lang="pug">
  div
    template(v-if="editing")
      input(
        name="pipe"
        v-model="newPipeValue"
        style="max-width: 100%"
        maxlength="24"
        v-disabled="updating"
      )
      button.btn.btn-sm(
        v-disabled="updating"
        @click.prevent.stop="patchPipe"
      )
        i.fa.fa-fw.fa-btn.fa-spin.fa-spinner(v-if="updating")
        i.fa.fa-fw.fa-btn.fa-floppy(v-else)
    template(v-else)
      | pipe: {{item.pipe}}&#32;
      button.btn.btn-sm(
        @click.prevent.stop="newPipeValue = item.pipe; editing = true"
      ): i.fa.fa-edit
    br
    br
    template(v-if="item.removed") removed
    button.btn.btn-sm(
      v-else
      @click.stop.prevent="remove"
      v-disabled="deleting"
    )
      i.fa.fa-fw.fa-btn.fa-spin.fa-spinner(v-if="deleting")
      i.fa.fa-fw.fa-btn.fa-trash(v-else)
    br
    br
    AddToQueueButton(:item="item.rItem")
    br
    br
    nuxt-link(
      v-if="item.link_id"
      :to="$mergeRouteQuery({link_id: item.link_id})"
    ) thread
    | &#32;
    nuxt-link(
      v-if="item.subreddit"
      :to="$mergeRouteQuery({subreddit: item.subreddit})"
    ) subreddit
    | &#32;
    nuxt-link(
      v-if="item.author"
      :to="$mergeRouteQuery({author: item.author})"
    ) author
    br
    br
</template>

<script>
import AddToQueueButton from '~/components/AddToQueueButton';

export default {
  name: 'PipeItemMenu',
  components: {
    AddToQueueButton,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  // mixins: [busyUntil],
  data() {
    return {
      editing: false,
      updating: false,
      deleting: false,
      newPipeValue: null,
    };
  },
  computed: {
    client() {
      return this.$store.getters['pipes/client'](
        this.$route.params.endpoint_name,
      );
    },
  },
  methods: {
    async remove() {
      const { item } = this;
      try {
        this.deleting = true;

        await this.client.items.remove(item.id);

        this.$set(item, 'removed', true);
      } finally {
        this.deleting = false;
      }
    },
    async patchPipe() {
      const { item, newPipeValue } = this;
      try {
        this.updating = true;

        await this.client.items.patch(item.id, {
          pipe: newPipeValue,
        });

        this.$set(item, 'pipe', newPipeValue);
        this.editing = false;
      } finally {
        this.updating = false;
      }
    },
  },
};
</script>
