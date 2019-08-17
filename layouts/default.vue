<template lang="pug">
  div
    NavBar
    QueueBar
    nuxt
    div.last-br
    BackToTop
      button.btn.btn-info.btn-to-top(type="button")
        i.fa.fa-up-open
</template>

<script>
import BackToTop from 'vue-backtotop';
import NavBar from '~/components/NavBar';
import QueueBar from '~/components/QueueBar';

export default {
  components: {
    BackToTop,
    NavBar,
    QueueBar,
  },
};
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 7.5px;
  margin-right: 7.5px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 7.5px;
  margin-right: 7.5px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.last-br {
  /* the user needs to be able to scroll back far enough to click buttons */
  /* otherwise the scroll to top button wiill block other buttons */
  padding-bottom: 10rem;
}

.fa-btn {
  /*margin: -2px;*/
  /* increase clickable area */
  padding: 4px;
}
</style>
