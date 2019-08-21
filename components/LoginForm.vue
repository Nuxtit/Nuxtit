<template lang="pug">
//- b-form(
//-   @submit.prevent.stop='onSubmit'
//-   @reset.prevent.stop='onReset'
//- )
//-   b-form-group(
//-     label='Username:'
//-     :label-for='`username${_uid}`'
//-   )
//-     b-form-input(
//-       :id='`username${_uid}`'
//-       v-model='username'
//-       type='text'
//-       required
//-       placeholder='Enter username'
//-     )
//-   b-form-group(
//-     label='Password:'
//-     :label-for='`password${_uid}`'
//-   )
//-     b-form-input(
//-       :id='`password${_uid}`'
//-       v-model='password'
//-       type='password'
//-       required
//-       placeholder='Enter password'
//-     )
//-   b-button(type='submit', variant='primary') Submit
//-   b-button(type='reset', variant='danger') Reset
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      // username: 'can_not',
      username: 'LeBuddha',
      password: 'Onesic8i#3',
    };
  },
  mounted() {
    throw new Error('do not use atm');
  },
  methods: {
    async onSubmit() {
      await this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password,
      });
      this.$router.push('/');
    },
    onReset() {
      this.username = '';
      this.password = '';
    },
  },
};
</script>

<style></style>
