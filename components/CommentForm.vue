<template lang="pug">
  .comment-form
    b-form-textarea.comment-body(
      v-model="body"
      :rows="3"
    )
    p
      span(v-if='isEditing') Editing
      span(v-if='isReplying') Replying
      | &#32;
      | as
      | &#32;
      SelectAuthUsername(v-if="!isEditing" v-model="selectedUsername")
      UserLink(v-if="isEditing" :username='selectedUsername || MeData.name')
    .alert.alert-danger(v-if='errors')
      pre.text-monospace {{ errors }}
    button.btn.btn-secondary(
      v-disabled='isSaveDisabled'
      @click.prevent.stop='save'
    )
      i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if='saving')
      i.fa.fa-fw.fa-btn.fa-floppy(v-else)
      span(v-if='editingComment && editingComment.id && saving') Updating
      span(v-else-if='editingComment && editingComment.id && editingComment.body === body') Update
      span(v-else-if='editingComment && editingComment.id') Update
      span(v-else-if='saving') Saving
      span(v-else) Save
    button.btn.btn-info.btn-cancel(
      @click.prevent.stop='$emit("close")'
    )
      i.fa.fa-fw.fa-btn.fa-cancel
      span(v-if='!editingComment || !editingComment.id || body !== editingComment.body')
        | Cancel
        span.small(
          v-if='(body && !editingComment) || (editingComment && body !== editingComment.body)'
        )  (unsaved changes!)
      span(v-else) Done
</template>

<script>
import get from 'lodash/get';
import SelectAuthUsername from '~/components/SelectAuthUsername';
import UserLink from '~/components/UserLink';
import { startMinWait } from '~/lib/sleep';
import thingsToTree from '~/lib/thingsToTree';
import { mapGetters } from 'vuex';
import undata from '~/lib/undata';

export default {
  name: 'CommentForm',
  components: {
    SelectAuthUsername,
    UserLink,
  },
  props: {
    // only needed for reply
    parent: {
      type: Object,
      default: null,
    },
    // only needed for edit
    comment: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selectedUsername: null,
      body: '',
      editingComment: null,
      saving: false,
      trashing: false,
      errors: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['MeData']),
    isReplying() {
      if (this.isEditing) {
        return false;
      }
      return !!this.parent;
    },
    isEditing() {
      return !!this.editingComment;
    },
    isSaveDisabled() {
      if (this.busy) {
        return true;
      }
      if (!this.body) {
        return true;
      }
      // @todo more validate
      return false;
    },
  },
  mounted() {
    this.editingComment = this.comment;
    if (this.comment) {
      this.body = this.comment.body;
      this.selectedUsername = this.comment.author;
    }
  },
  methods: {
    async save($event) {
      const minWait = startMinWait();
      this.errors = null;
      try {
        this.saving = true;
        if (this.editingComment && this.editingComment.id) {
          const response = await this.$reddit.post(
            '/api/editusertext',
            {
              thing_id: this.editingComment.name,
              text: this.body,
              return_rtjson: true,
            },
            {
              username: this.editingComment.author,
            },
          );

          if (get(response, 'data.json.errors.length')) {
            this.errors = response.data.json.errors;
          } else {
            Object.assign(this.editingComment, undata(response.data));
            this.$emit('updated-comment', this.editingComment);
          }
        } else {
          const parent_id = this.parent.name;
          const response = await this.$reddit.post(
            '/api/comment',
            {
              thing_id: this.parent.name,
              text: this.body,
              return_rtjson: true,
              api_type: 'json',
            },
            {
              username: this.selectedUsername,
            },
          );

          if (get(response, 'data.json.errors.length')) {
            this.errors = response.data.json.errors;
          } else if (get(response, 'data.json.data.things')) {
            const tree = thingsToTree(
              get(response, 'data.json.data.things'),
              parent_id,
            );
            this.$emit('append-replies', tree);
          } else {
            this.editingComment = undata(response.data);
            this.$emit('created-comment', this.editingComment);
          }
        }
      } catch (err) {
        this.errors = err;
        throw err;
      } finally {
        await minWait;
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="sass">
.comment-form
  .comment-body
    width: unset;
    width: 32rem;
    max-width: 100%;
    resize: both;
</style>
