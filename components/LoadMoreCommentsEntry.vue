<template lang="pug">
CommentTree.comment-tree-loaded(
  v-if='comments'
  :comments='comments'
)
.load-more-comments-entry(v-else)
  .btn-load-more(
    @click.prevent.stop='loadMore'
  )
    i.fa.fa-fw.fa-spinner.fa-spin(v-if='fetching')
    i.fa.fa-fw.fa-comments(v-else)
    | load more comments ({{ item.data.count }} replies)
</template>

<script>
import find from 'lodash/find';
import startMinWait from '~/lib/sleep';

// the backend can't handle large incoming requests
const MAX_MORE_CHILDREN = 500;

export default {
  name: 'LoadMoreCommentsEntry',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: null,
      fetching: false,
    };
  },
  methods: {
    async loadMore($event) {
      const minWait = startMinWait();
      try {
        const { children, name, parent_id } = this.item.data;
        const { post_id } = this.$route.params;
        this.fetching = true;

        const response = await this.$reddit.get('/api/morechildren', {
          params: {
            api_type: 'json',
            // only first MAX_MORE_CHILDREN
            children: children.slice(0, MAX_MORE_CHILDREN).join(','),
            link_id: `t3_${post_id}`,
            sort: 'new',
          },
        });

        const allChildren = response.data.json.data.things || [];
        const rootChildren = allChildren.filter(
          i => i.data.parent_id === parent_id,
        );
        const otherChildren = allChildren.filter(
          i => i.data.parent_id !== parent_id,
        );
        otherChildren.forEach(c1 => {
          const c2 = find(
            allChildren,
            c2 => c2.data.name === c1.data.parent_id,
          );
          if (c2) {
            if (c2.data.replies) {
              c2.data.replies.data.children.push(c1);
            } else {
              c2.data.replies = {
                data: {
                  children: [c1],
                },
              };
            }
          }
        });

        this.$emit('append-children', rootChildren);
        this.$emit('remove-more', this.item);
      } finally {
        await minWait;
        this.fetching = false;
      }
    },
  },
};
</script>

<style lang="sass">
.load-more-comments-entry
  .btn-load-more
    cursor: pointer;
</style>
