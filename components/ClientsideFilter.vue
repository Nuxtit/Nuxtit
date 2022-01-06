<template lang="pug">
  b-nav-form.clientside-filter
    b-form-input.mr-sm-2(
      size='sm'
      type='text'
      placeholder='Filter Clientside'
      v-model='text'
    )
</template>

<script>
import get from 'lodash/get';
import {BNavForm} from 'bootstrap-vue/esm/components/nav/nav-form';
import {BFormInput} from 'bootstrap-vue/esm/components/form-input/form-input';
import {BButton} from 'bootstrap-vue/esm/components/button/button';
import { startMinWait } from '~/lib/sleep';

const keys = ['text'];

export default {
  name: 'ClientsideFilter',
  components: {
    BButton,
    BFormInput,
    BNavForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...keys.reduce((carry, key) => {
      carry[key] = {
        get() {
          // //eslint-disable-next-line
          // console.log(this.$options.name, 'get', key, get(this.value, key));
          return get(this.value, key);
        },
        set(newValue) {
          // //eslint-disable-next-line
          // console.log(this.$options.name, 'set', key, get(this.value, key), '=>', newValue);
          if (get(this.value, key) !== newValue) {
            this.$emit('input', {
              ...this.value,
              [key]: newValue,
            });
          }
        },
      };
      return carry;
    }, {}),
  },
};
</script>

<style lang="sass"></style>
