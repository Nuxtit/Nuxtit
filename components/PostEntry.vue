<template lang="pug">
.post-entry
  .row
    .b-col.b-col-score
      UpVote(:item='post')
      br
      Score(:item='post')
      br
      DownVote(:item='post')
    .b-col.b-col-thumbnail
      PostThumbnail(:post="post")
    .b-col.b-col-other
      .row
        b-col
          nuxt-link(
            v-if="post.data.is_self"
            :to='post.data.permalink'
            v-text='post.data.title'
          )
          a(
            v-if="!post.data.is_self"
            :href='post.data.url'
            target='_blank'
            ref='nofollow'
            v-text='post.data.title'
          )
          | &#32;
          template(v-if='post.data.link_flair_text')
            b-badge(v-text='post.data.link_flair_text')
            | &#32;
          small(v-if='post.data.domain'): tt
            nuxt-link(
              :to='post.data.is_self ? `/r/${post.data.domain}` : `/domain/${post.data.domain}`'
              v-text='`(${post.data.domain})`'
            )
      .row
        b-col.small
          | submitted
          | &#32;
          TimeAgo(:value='post.data.created_utc')
          | &#32;
          | by
          | &#32;
          nuxt-link(
            :to='`/user/${post.data.author}`'
            v-text='post.data.author'
          )
          | &#32;
          | to
          | &#32;
          nuxt-link(
            :to='`/r/${post.data.subreddit}`'
            v-text='post.data.subreddit_name_prefixed'
          )
          | &#32;
      .row
        b-col.small
          nuxt-link(
            :to='post.data.permalink'
          )
            | {{ post.data.num_comments }}
            | &#32;
            i.fa.fa-fw.fa-comments
            span comments
          | &#32;
          a(
            :href='`https://www.reddit.com${post.data.permalink}`'
            target='_blank'
          )
            i.fa.fa-fw.fa-reddit
            span see on reddit
          | &#32;
          SaveButton(:item='post')
          | &#32;
          ShareButton(:item='post')
          | &#32;
          HideButton(:item='post')
          | &#32;
          RemoveButton(:item='post')
          | &#32;
          DeleteButton(:item='post' v-if='isAuthor')
          | &#32;
          //- GiveGoldButton(:item='post' v-if='!isAuthor')
          //- | &#32;
          ReportButton(:item='post' v-if='!isAuthor')
          | &#32;
          span.btn-edit-toggle(
            v-if='isAuthor'
            @click.prevent.stop='showEdit^=true'
          )
            i.fa.fa-fw.fa-edit
            span edit
          span.btn-reply-toggle(
            @click.prevent.stop='showReply^=true'
          )
            i.fa.fa-fw.fa-reply
            span reply
          CrossPostButton(:item='post')
          | &#32;
          span.btn-see-source(
            @click.prevent.stop='showSource^=true'
          )
            i.fa.fa-fw.fa-code
            span see source
  .row(v-if="showSource")
    b-col
      pre
        tt: small(v-text="post.data")
</template>

<script>
import bCol from 'bootstrap-vue/es/components/layout/col';
import CommentEntry from '~/components/CommentEntry';
import CrossPostButton from '~/components/CrossPostButton';
import DeleteButton from '~/components/DeleteButton';
import DownVote from '~/components/DownVote';
import HideButton from '~/components/HideButton';
import PostThumbnail from '~/components/PostThumbnail';
import RemoveButton from '~/components/RemoveButton';
import ReportButton from '~/components/ReportButton';
import SaveButton from '~/components/SaveButton';
import Score from '~/components/Score';
import ShareButton from '~/components/ShareButton';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';

export default {
  name: 'PostEntry',
  components: {
    bCol,
    CommentEntry,
    CrossPostButton,
    DeleteButton,
    DownVote,
    HideButton,
    PostThumbnail,
    RemoveButton,
    ReportButton,
    SaveButton,
    Score,
    ShareButton,
    TimeAgo,
    UpVote,
    UserLink,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showSource: false,
    };
  },
  computed: {
    isAuthor() {
      const { author } = this.post.data;
      return author && author === this.MeData.name;
    },
    MeData() {
      return this.$store.state.auth.MeData || {};
    },
  },
};
</script>

<style lang="sass">
.post-entry + .post-entry
  border-top: 1px solid #444;
.post-entry
  padding-top: 5px;
  padding-bottom: 5px;
  .b-col
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  .b-col-score
    text-align: center;
    width: 100px;
  .b-col-thumbnail
    width: 140px;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 15px;
    margin-left: 15px;
  .b-col-other
    flex: 1;
  .btn-collapse, .btn-reply-toggle, .btn-edit-toggle, .btn-see-source
    cursor: pointer;
</style>
