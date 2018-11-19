<template lang="pug">
  .post-form.container
    .form-group.post-kind.row
      label.col-6 Kind
      b-select.col-6(
        v-model="kind"
        :options='$options.kinds'
      )
    .form-group.post-url(v-if='!selftext')
      label URL
      b-form-input(
        v-model="url"
      )
    .form-group.post-url
      label Title
      b-form-input(
        v-model="title"
      )
    .form-group.post-body(v-if='selftext')
      label Text
      b-form-textarea(
        v-model="body"
        :rows="3"
      )
    .form-group.post-url
      label
        | subreddit
        span(v-if='isCrossPosting')
        | x-post from /r/{{ parent.data.subreddit }}
      b-form-input(
        v-model="sr"
      )
    p
      span(v-if='isEditing') Editing
      span(v-else-if='isCrossPosting') Cross Posting
      span(v-else) New Submission
      | &#32;
      | as
      | &#32;
      UserLink(:username='MeData.name')
    .alert.alert-danger(v-if='errors')
      tt: pre {{ errors }}
    button.btn.btn-secondary(
      v-disabled='isSaveDisabled'
      @click.prevent.stop='save'
    )
      i.fa.fa-fw.fa-spinner.fa-spin(v-if='saving')
      i.fa.fa-fw.fa-save(v-else)
      span(v-if='editingPost && editingPost.data.id && saving') Updating
      span(v-else-if='editingPost && editingPost.data.id && editingPost.data.body === body') Update
      span(v-else-if='editingPost && editingPost.data.id') Update
      span(v-else-if='saving') Saving
      span(v-else) Save
    button.btn.btn-info.btn-cancel(
      @click.prevent.stop='$emit("close")'
    )
      i.fa.fa-fw.fa-times
      span(v-if='!editingPost || !editingPost.data.id || body !== editingPost.data.body')
        | Cancel
        span.small(
          v-if='(body && !editingPost) || (editingPost && body !== editingPost.data.body)'
        )  (unsaved changes!)
      span(v-else) Done
    .crossposts(v-if='crossPosts.length')
      | Cross Posts:
      table
        tbody
          tr(v-for='post in crossPosts')
            td /u/{{ post.data.author }}
            td /r/{{ post.data.subreddit }}
            td
              nuxt-link(
                :to='post.data.permalink'
                v-text='post.data.id'
              )
            td
              a(
                target='_blank'
                :href='`https://www.reddit.com${post.data.permalink}`'
              )
                i.fa.fa-fw.fa-reddit
</template>

<script>
import get from 'lodash/get';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';

import QueryParamSelftext from '~/mixins/QueryParamSelftext';
import UserLink from '~/components/UserLink';
import { startMinWait } from '~/lib/sleep';

export default {
  name: 'PostForm',
  components: {
    bFormInput,
    bFormTextarea,
    UserLink,
  },
  mixins: [QueryParamSelftext],
  props: {
    // only needed for crosspost
    parent: {
      type: Object,
      default: null,
    },
    // only needed for edit
    post: {
      type: Object,
      default: null,
    },
  },
  kinds: Object.freeze([
    { value: 'self', text: 'Self' },
    { value: 'link', text: 'Link' },
    { value: 'image', text: 'Image' },
    // { value: 'video', text: 'Video' },
    // { value: 'videogif', text: 'Video GIF' },
  ]),
  data() {
    return {
      kind: 'link',
      title: '',
      url: '',
      video_poster_url: '',
      body: '',
      nsfw: false,
      resubmit: true,
      sendreplies: true,
      spoiler: false,
      sr: this.$route.params.subreddit || null,
      editingPost: null,
      saving: false,
      trashing: false,
      errors: null,
      crossPosts: [],
    };
  },
  computed: {
    isCrossPosting() {
      if (this.isEditing) {
        return false;
      }
      return !!this.parent;
    },
    isEditing() {
      return !!this.editingPost;
    },
    isSaveDisabled() {
      if (this.busy) {
        return true;
      }
      if (!this.title) {
        return true;
      }
      if (!(this.url || this.body)) {
        return true;
      }
      // @todo more validate
      return false;
    },
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
  },
  mounted() {
    this.editingPost = this.post;
    if (this.isEditing) {
      this.body = this.post.data.selftext;
    } else if (this.isCrossPosting) {
      this.kind = 'link';
      this.title = this.parent.data.title;
      this.url = this.parent.data.url;
      // this.video_poster_url = this.parent.data.video_poster_url;
      this.body = this.parent.data.selftext;
      // this.nsfw = this.parent.data.nsfw;
      // this.resubmit = this.parent.data.resubmit;
      // this.sendreplies = this.parent.data.sendreplies;
      // this.spoiler = this.parent.data.spoiler;
    }
  },
  methods: {
    async save($event) {
      const minWait = startMinWait();
      try {
        this.saving = true;
        this.errors = null;
        if (this.editingPost && this.editingPost.data.id) {
          // @todo
          const kind = this.selftext ? 'self' : 'link';

          const response = await this.$reddit.post('/api/editusertext', {
            // thing_id: this.editingPost.data.name,
            extension: 'json',
            sr: this.sr,
            title: this.title,
            url: this.selftext ? void 0 : this.url,
            text: this.selftext ? this.body : void 0,
            return_rtjson: true,
            api_type: 'json',
            // flair_id: // a string no longer than 36 characters
            // flair_text: //a string no longer than 64 characters
            kind: this.kind, // one of (link, self, image, video, videogif)
            nsfw: !!this.nsfw,
            resubmit: !!this.resubmit,
            spoiler: !!this.spoiler,
          });

          if (get(response, 'data.json.errors.length')) {
            this.errors = response.data.json.errors;
          } else {
            Object.assign(this.editingPost.data, response.data);
            this.$emit('updated-post', this.editingPost);
          }
        } else {
          const response = await this.$reddit.post('/api/submit', {
            // thing_id: this.editingPost.data.name,
            extension: 'json',
            sr: this.sr,
            title: this.title,
            url: this.selftext ? void 0 : this.url,
            text: this.selftext ? this.body : void 0,
            return_rtjson: true,
            api_type: 'json',
            // flair_id: // a string no longer than 36 characters
            // flair_text: //a string no longer than 64 characters
            kind: this.kind, // one of (link, self, image, video, videogif)
            nsfw: !!this.nsfw,
            resubmit: !!this.resubmit,
            spoiler: !!this.spoiler,
          });

          if (get(response, 'data.json.errors.length')) {
            this.errors = response.data.json.errors;
          } else {
            const xpost_name = response.data.json.data.name;
            const response2 = await this.$reddit.get(`/by_id/${xpost_name}`);
            const xpost = get(response2.data, 'data.children.0');
            if (xpost) {
              this.crossPosts.push(get(response2.data, 'data.children.0'));
            }
            // this.editingPost = {
            //   kind: 't1',
            //   data: response.data,
            // };
            // this.$emit('created-post', this.editingPost);
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
.post-form
  .post-kind
    width: 32rem;
  .post-url
    width: 32rem;
  .post-body
    width: unset;
    width: 32rem;
    max-width: 100%;
    resize: both;
</style>
