<template lang="pug">
b-navbar(toggleable='md', type='dark')
  b-navbar-toggle(target='nav_collapse')
  b-navbar-brand(href='/')
    | Redusa
  b-collapse#nav_collapse(is-nav='')
    b-navbar-nav
      b-nav-item(to='/home') Home
      b-nav-item(href='#', disabled='') Disabled
    // Right aligned nav items
    b-navbar-nav.ml-auto
      //- b-nav-form
      //-   b-form-input.mr-sm-2(size='sm', type='text', placeholder='Search')
      //-   b-button.my-2.my-sm-0(size='sm', type='submit') Search

      b-nav-item(right to='/mail' title="Mail")
        i.fa.fa-envelope.text-danger(v-if="MeData.has_mail")
        i.fa.fa-envelope-o(v-else)

      b-nav-item(right href='https://mod.reddit.com/' title="Mail" v-if="MeData.has_mod_mail")
        i.fa.fa-shield.text-danger(v-if="MeData.new_modmail_exists")
        i.fa.fa-shield(v-else)

      b-nav-item-dropdown(right v-if="MeData.name")
        // Using button-content slot
        template(slot='button-content')
          em {{ MeData.name }}
        b-dropdown-item(:to='`/user/${MeData.name}`') Profile
        b-dropdown-item(to='/logout') Signout
      b-nav-item(right v-else to='/login')
        | Signin
</template>

<script>
import get from 'lodash/get';
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand';
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle';
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav';
import bNavForm from 'bootstrap-vue/es/components/nav/nav-form';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown';

export default {
  name: 'NavBar',
  components: {
    bNavbar,
    bNavbarBrand,
    bNavbarToggle,
    bNavbarNav,
    bNavForm,
    bNavItem,
    bNavItemDropdown,
  },
  computed: {
    MeData() {
      return this.$store.state.auth.MeData || {};
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
    // inbox_count() {
    //   return get(this.MeData, 'inbox_count', 0);
    // },
    // is_suspended() {
    //   return get(this.MeData, 'is_suspended', false);
    // },
    // new_modmail_exists() {
    //   return get(this.MeData, 'new_modmail_exists', false);
    // },
  },
};
</script>

<style lang="sass">
</style>
