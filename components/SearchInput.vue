<template lang="pug">
  b-nav-form.search-input(
    @submit.prevent.stop='submit'
  )
    b-form-input.mr-sm-2(
      size='sm'
      type='text'
      placeholder='Search'
      v-model='q'
    )
    b-button.my-2.my-sm-0(
      :disabled="busy"
      size='sm'
      type='submit'
      @keyup.enter.prevent.stop="$emit('update-search')"
      @click.prevent.stop="$emit('update-search')"
    )
      i.fa.fa-fw.fa-btn.fa-spinner.fa-spin(v-if="busy")
      i.fa.fa-fw.fa-btn.fa-search(v-if="!busy")
      | &#32;
      | Search
</template>

<script>
import get from 'lodash/get';
import bNavForm from 'bootstrap-vue/es/components/nav/nav-form';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bButton from 'bootstrap-vue/es/components/button/button';
import { startMinWait } from '~/lib/sleep';

const searchRegEx = /\bsearch\b/;

export default {
  name: 'SearchInput',
  components: {
    bButton,
    bFormInput,
    bNavForm,
  },
  props: {
    busy: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    q: {
      get() {
        return this.$route.query.q;
      },
      set(value) {
        this.$router.push(
          this.$mergeRouteQuery({
            q: value || void 0,
          }),
        );
      },
    },
    subreddit() {
      return this.$route.params.subreddit;
    },
    isSearchPage() {
      return searchRegEx.test(this.$route.name);
    },
  },
  mounted() {
    this.q = this.$route.query.q || '';
    // if (this.isSearchPage) {
    //   if (this.q) {
    //     console.log('do search');
    //   } else {
    //     console.log('wait for search text');
    //   }
    // }
  },
  methods: {
    async submit($event) {
      const { q, subreddit, isSearchPage } = this;
      if (isSearchPage) {
        // console.log('updating search');
        this.$router.push({
          query: {
            ...this.$route.query,
            q,
          },
        });
      } else {
        // console.log('lets goto search page');
        this.$router.push({
          name: 'search',
          query: {
            q,
            subreddit,
          },
        });
      }
    },
  },
};
</script>

<style lang="sass">
</style>
