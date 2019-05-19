<template lang="pug">
b-navbar(toggleable='md', type='dark')
  b-navbar-toggle(target='nav_collapse')
  b-navbar-brand(href='/')
    img(src='/favicon-32x32.png' alt='Redusa')
    | &#32;
    | Redusa
  b-collapse#nav_collapse(is-nav)
    b-navbar-nav
      b-nav-item(to='/home') Home
      b-nav-item(to='/multis/mine') MultiSubs
      b-nav-item(to='/subreddits') Subreddits

    // Right aligned nav items
    b-navbar-nav.ml-auto
      .btn-group
        nuxt-link.btn.btn-primary(to='/search')
          i.fa.fa-search.fa-btn
          | Search
        nuxt-link.btn.btn-primary(to='/pushshift/search')
          | Pushshift


      b-nav-item-dropdown(right v-if="MeData.name")
        // Using button-content slot
        template(slot='button-content')
          em {{ MeData.name }}
        b-dropdown-item(:to='`/user/${MeData.name}`') Profile
        b-dropdown-divider
        b-dropdown-item(to='/redusa/settings') Settings
        b-dropdown-item(
          @click='censorUsernames^=true'
        )
          i.fa.fa-btn.fa-check-square-o(v-if='censorUsernames')
          i.fa.fa-btn.fa-square-o(v-else)
          | &#32;
          | Censor Usernames
        b-dropdown-divider
        b-dropdown-item(to='/redusa/history')
          | History
          |
          b-badge(
            v-if='historyCount'
            v-text='historyCount'
          )
        b-dropdown-item(to='/redusa/apilog')
          | API Log
          |
          b-badge(
            variant='danger'
            v-if='apilogErrorCount'
            v-text='apilogErrorCount'
          )
        b-dropdown-divider
        b-dropdown-item(to='/logout') Signout
      b-nav-item(right v-else to='/login')
        | Signin
  b-navbar-nav
    b-nav-item(right to='/message/inbox' title="Mail")
      b-badge.text-secondary(
        v-if="MeData.has_mail"
        variant='danger'
      )
        i.fa.fa-btn.fa-envelope
        | {{ inbox_count }}
      i.fa.fa-btn.fa-envelope-o(v-else)

    b-nav-item(right href='https://mod.reddit.com/' title="Mail" v-if="MeData.has_mod_mail")
      b-badge.text-secondary(
        variant='success'
      )
        i.fa.fa-btn.fa-shield
</template>

<script>
import get from 'lodash/get';
import bDropdownDivider from 'bootstrap-vue/es/components/dropdown/dropdown-divider';
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand';
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle';
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav';
import bNavForm from 'bootstrap-vue/es/components/nav/nav-form';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown';
import SearchInput from '~/components/SearchInput';
import { mapGetters } from 'vuex';

export default {
  name: 'NavBar',
  components: {
    bNavbar,
    bNavbarBrand,
    bNavbarToggle,
    bNavbarNav,
    bDropdownDivider,
    bNavForm,
    bNavItem,
    bNavItemDropdown,
    SearchInput,
  },
  computed: {
    ...mapGetters('auth', ['MeData']),
    censorUsernames: {
      get() {
        return this.$store.getters['settings/censorUsernames'];
      },
      set(value) {
        return this.$store.dispatch('settings/censorUsernames', value);
      },
    },
    historyCount() {
      return this.$store.getters['history/count'];
    },
    apilogErrorCount() {
      return this.$store.getters['apilog/errorCount'];
    },
    /**
     * @todo
     **/
    showRedditSort() {
      const { name } = this.$route;
      if (!name) return false;
      // if (name === 'r-subreddit')
      return true;
    },
    // has_mail() {
    //   return get(this.MeData, 'has_mail', false);
    // },
    // has_mod_mail() {
    //   return get(this.MeData, 'has_mod_mail', false);
    // },
    // comment_karma() {
    //   return get(this.MeData, 'comment_karma', 0);
    // },
    // link_karma() {
    //   return get(this.MeData, 'link_karma', 0);
    // },
    inbox_count() {
      return get(this.MeData, 'inbox_count', 0);
    },
    // is_suspended() {
    //   return get(this.MeData, 'is_suspended', false);
    // },
    // new_modmail_exists() {
    //   return get(this.MeData, 'new_modmail_exists', false);
    // },
    isSearchPage() {
      return searchRegEx.test(this.$route.name);
    },
  },
};

const searchRegEx = /\bsearch\b/;
</script>

<style lang="sass">
</style>
