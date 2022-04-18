<template lang="pug">
  div
    .alert.alert-danger(v-if="error" v-text="error")
    button.btn.btn-primary(@click.prevent.stop="mergeFromPs") Merge From Pushshift
</template>

<script>
/* eslint vue/require-prop-types: 0 */
import pushshift from '~/lib/pushshift';
import { pathFromKind } from '~/mixins/PushshiftItems';

export default {
  name: 'ItemPushShiftMenu',
  data () {
    return {
      error: null,
    };
  },
  props: {
    item: {
      default: null,
    },
  },
  methods: {
    async mergeFromPs () {
      try {
        this.busy = true
        this.error = null
        const { id, kind } = this.item;
        const resp = await pushshift.get(pathFromKind(kind), {
          params: {
            ids: id,
          },
        })
        const pushshiftItem = resp.data.data[0]
        console.log('pushshiftItem', pushshiftItem)
        if (!(pushshiftItem && pushshiftItem.id && pushshiftItem.id === id)) {
          throw new Error(`No pushshift rows found for ids=${id}`);
        }
        const newValue = {
          redditItem: this.item,
          ...this.item,
          ...pushshiftItem,
          pushshiftItem,
        };
        // protect against double nesting
        delete newValue.redditItem.redditItem;
        delete newValue.redditItem.pushshiftItem;
        this.$emit('update:item', newValue);
      } catch (err) {
        this.error = err
        console.log(err)
      } finally {
        this.busy = true
      }
    },
  },
};
</script>
