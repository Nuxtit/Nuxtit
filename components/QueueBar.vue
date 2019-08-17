<template lang="pug">
.btn-group(v-show='queueCount')
  nuxt-link.btn.btn-secondary(
    to='/redusa/queue'
  )
    i.fa.fa-fw.fa-database
    | ({{ queueCount }})
  .btn.btn-secondary(
    v-if='moreThanOne && isPageQueued && !isLast'
    @click.prevent.stop='requeueAndNext'
  )
    i.fa.fa-fw.fa-arrows-cw
  .btn.btn-secondary(
    v-if='isPageQueued'
    @click.prevent.stop='popAndStay'
  )
    i.fa.fa-fw.fa-eject
  a.btn.btn-secondary(
    v-if='nextEntry'
    :href='nextEntry.route'
    @click.prevent.stop='popNext'
  )
    i.fa.fa-fw.fa-to-end
    small {{ (nextEntry.text || '').slice(0, 64) }}
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import bDropdownDivider from 'bootstrap-vue/es/components/dropdown/dropdown-divider';
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand';
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle';
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav';
import bNavForm from 'bootstrap-vue/es/components/nav/nav-form';
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown';
import SearchInput from '~/components/SearchInput';

export default {
  name: 'QueueBar',
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
    firstEntry() {
      return this.$store.getters['queue/first'];
    },
    nextEntry() {
      const { currentEntry, firstEntry } = this;
      const list = this.$store.getters['queue/list'];
      if (currentEntry) {
        const index = this.$store.getters['queue/findIndex'](currentEntry);
        if (index >= 0 && list[index + 1]) {
          return list[index + 1];
        }
        if (index > 0) {
          return list[0];
        }
      }
      if (!currentEntry && firstEntry) {
        return firstEntry;
      }
      return null;
    },
    lastEntry() {
      return this.$store.getters['queue/last'];
    },
    queueCount() {
      return this.$store.getters['queue/count'];
    },
    moreThanOne() {
      return this.queueCount > 1;
    },
    isPageQueued() {
      return !!this.currentEntry;
    },
    isLast() {
      if (!this.isPageQueued) return false;
      if (!this.lastEntry) return false;
      return this.currentEntry === this.lastEntry;
    },
    currentEntry() {
      const { fullPath } = this.$route;
      return find(this.$store.getters['queue/list'], entry => {
        return entry.route === fullPath;
      });
    },
  },
  methods: {
    popAndStay() {
      const { currentEntry } = this;
      if (currentEntry) {
        this.$store.dispatch('queue/done', currentEntry);
      }
    },
    requeueAndNext() {
      const { currentEntry, nextEntry } = this;
      if (nextEntry && nextEntry !== currentEntry) {
        this.$store.dispatch('queue/requeue', currentEntry);
        this.$router.push(nextEntry.route);
      }
    },
    popNext() {
      const { currentEntry, nextEntry } = this;
      if (nextEntry && nextEntry !== currentEntry) {
        this.$store.dispatch('queue/done', currentEntry);
      }
      if (nextEntry) {
        this.$router.push(nextEntry.route);
      }
    },
  },
};
</script>

<style lang="sass">
</style>
