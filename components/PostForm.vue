<template lang="pug">
  .post-form.container
    .form-group.post-kind.row
      label.col-6 Kind
      b-select.col-6(
        v-model="kind"
        :options='$options.kinds'
      )
      | {{ {kind, isEditing} }}
    .form-group.post-url(v-if='kind !== "self"')
      label URL
      b-form-input(
        :disabled='isEditing'
        v-model="url"
      )
      span.btn.btn-info.btn-sm(
        v-if='parent && url != parent.url'
        @click="url = parent.url"
      )
        i.fa.fa-fw.fa-arrows-cw
      span.btn.btn-info.btn-sm(
        v-if='url'
        @click="url = ''"
      )
        i.fa.fa-fw.fa-cancel
    .form-group.post-url
      label Title
      b-form-input(
        :disabled='isEditing'
        v-model="title"
      )
      .btn-group.pull-right
        span.btn.btn-info.btn-sm(
          v-if='isCrossPosting && !title.includes(parent.subreddit)'
          @click="title = `${title.trim()} (xpost from /r/${parent.subreddit})`"
        )
          | (xpost from /u/{{ parent.subreddit }})
        span.btn.btn-info.btn-sm(
          v-if='isCrossPosting && !title.includes(parent.author)'
          @click="title = `${title.trim()} (xpost from /u/${parent.author})`"
        )
          | (xpost from /u/{{ parent.author }})
        span.btn.btn-info.btn-sm(
          v-if='parent && title != parent.title'
          @click="title = parent.title"
        )
          i.fa.fa-fw.fa-arrows-cw
        span.btn.btn-info.btn-sm(
          v-if='title != ""'
          @click="title = ''"
        )
          i.fa.fa-fw.fa-cancel
    .form-group.post-body(v-if='kind === "self"')
      label Text
      b-form-textarea(
        v-model="body"
        :rows="3"
      )
    .form-group.post-url
      label
        | subreddit
        span(v-if='isCrossPosting')
          | x-post from /r/{{ parent.subreddit }}
      b-form-input(
        :disabled='isEditing'
        v-model="sr"
      )
    .form-group.post-url
      b-form-checkbox(
        :disabled='isEditing'
        v-model="sendreplies"
      ) sendreplies
    .form-group.post-url
      b-form-checkbox(
        :disabled='isEditing'
        v-model="nsfw"
      ) nsfw
    .form-group.post-url
      b-form-checkbox(
        :disabled='isEditing'
        v-model="spoiler"
      ) spoiler
    .form-group.post-url(
      v-if="originalContentTagEnabled"
    )
      b-form-checkbox(
        v-model="oc"
      ) oc
    p
      span(v-if='isEditing') Editing
      span(v-else-if='isCrossPosting') Cross Posting
      span(v-else) New Submission
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
      span(v-if='editingPost && editingPost.id && saving') Updating
      span(v-else-if='editingPost && editingPost.id && editingPost.body === body') Update
      span(v-else-if='editingPost && editingPost.id') Update
      span(v-else-if='saving') Saving
      span(v-else) Save
    button.btn.btn-info.btn-cancel(
      @click.prevent.stop='$emit("close")'
    )
      i.fa.fa-fw.fa-btn.fa-cancel
      span(v-if='!editingPost || !editingPost.id || body !== editingPost.body')
        | Cancel
        span.small(
          v-if='(body && !editingPost) || (editingPost && body !== editingPost.body)'
        )  (unsaved changes!)
      span(v-else) Done
    .crossposts(v-if='crossPosts.length')
      | Cross Posts:
      table
        tbody
          tr(v-for='post in crossPosts')
            td
              nuxt-link(
                :to='`/u/${post.author}`'
                v-text='`/u/${post.author}`'
              )
            td
              nuxt-link(
                :to='`/r/${post.subreddit}`'
                v-text='`/r/${post.subreddit}`'
              )
            td
              AddToQueueButton(:item='post')
            td
              nuxt-link(
                :to='post.permalink'
                v-text='post.id'
              )
            td
              a(
                target='_blank'
                :href='`https://www.reddit.com${post.permalink}`'
              )
                i.fa.fa-fw.fa-btn.fa-reddit
</template>

<script>
import get from 'lodash/get';
import AddToQueueButton from '~/components/AddToQueueButton';
import SelectAuthUsername from '~/components/SelectAuthUsername';
import {BFormInput} from 'bootstrap-vue/esm/components/form-input/form-input';
import QueryParamSelftext from '~/mixins/QueryParamSelftext';
import UserLink from '~/components/UserLink';
import { startMinWait } from '~/lib/sleep';
import { mapGetters } from 'vuex';
import undata from '~/lib/undata';

export default {
  name: 'PostForm',
  components: {
    AddToQueueButton,
    BFormInput,
    SelectAuthUsername,
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
      selectedUsername: null,
      kind: 'link',
      title: '',
      url: '',
      video_poster_url: '',
      body: '',
      nsfw: false,
      resubmit: true,
      sendreplies: true,
      spoiler: false,
      oc: false,
      sr: this.$route.params.subreddit || null,
      editingPost: null,
      saving: false,
      trashing: false,
      errors: null,
      crossPosts: [],
      // subredditCache: {},
      // subredditCachePromises: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['MeData']),
    isCrossPosting() {
      if (this.isEditing) {
        return false;
      }
      return !!this.parent;
    },
    isSelf() {
      return this.kind === 'self';
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
    originalContentTagEnabled() {
      // if (this.sr && this.subredditCache[this.sr]) {
      //   return this.subredditCache[this.sr].original_content_tag_enabled;
      // }
      return null;
    },
  },
  mounted() {
    this.editingPost = this.post;
    if (this.isEditing) {
      this.title = this.post.title;
      this.body = this.post.selftext;
      this.kind = this.post.is_self ? 'self' : 'link';
      this.sr = this.post.subreddit;
      this.nsfw = this.post.over_18;
      this.sendreplies = this.post.send_replies;
      this.spoiler = this.post.spoiler;
      this.selectedUsername = this.post.author;
    } else if (this.isCrossPosting) {
      this.kind = 'link';
      this.title = this.parent.title;
      this.url = this.parent.url;
      // this.video_poster_url = this.parent.video_poster_url;
      this.body = this.parent.selftext;
      // this.nsfw = this.parent.nsfw;
      // this.resubmit = this.parent.resubmit;
      // this.sendreplies = this.parent.sendreplies;
      // this.spoiler = this.parent.spoiler;
    }
  },
  methods: {
    async save($event) {
      const minWait = startMinWait();
      try {
        this.saving = true;
        this.errors = null;
        if (this.editingPost && this.editingPost.id) {
          // @todo
          const kind = this.selftext ? 'self' : 'link';

          if (this.body !== this.editingPost.selftext) {
            const response = await this.$reddit.post(
              '/api/editusertext',
              {
                thing_id: this.editingPost.name,
                text: this.body,
                return_rtjson: true,
                api_type: 'json',
              },
              {
                username: this.editingPost.author,
              },
            );

            if (get(response, 'data.json.errors.length')) {
              this.errors = response.data.json.errors;
            } else {
              Object.assign(this.editingPost, undata(response.data));
              this.$emit('updated-post', this.editingPost);
            }
          }
        } else {
          const response = await this.$reddit.post(
            '/api/submit',
            {
              // thing_id: this.editingPost.name,
              extension: 'json',
              sr: this.sr,
              title: this.title,
              url: this.isSelf ? void 0 : this.url,
              text: this.isSelf ? this.body : void 0,
              return_rtjson: true,
              api_type: 'json',
              // flair_id: // a string no longer than 36 characters
              // flair_text: //a string no longer than 64 characters
              kind: this.kind, // one of (link, self, image, video, videogif)
              nsfw: !!this.nsfw,
              resubmit: !!this.resubmit,
              spoiler: !!this.spoiler,
              sendreplies: !!this.sendreplies,
            },
            {
              username: this.selectedUsername,
            },
          );

          if (get(response, 'data.json.errors.length')) {
            this.errors = response.data.json.errors;
          } else {
            const xpost_name = response.data.json.data.name;
            const response2 = await this.$reddit.get(`/by_id/${xpost_name}`);
            const xpost = undata(get(response2.data, 'data.children.0'));
            if (xpost) {
              this.crossPosts.push(xpost);
            }
            // this.editingPost = undata(response.data);
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
