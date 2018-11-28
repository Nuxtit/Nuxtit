<template lang="pug">
  section.container.index
    div
      h1.title
        img(src='/android-chrome-192x192.png' alt='Redusa')
        | &#32;
        | Redusa
      h2.subtitle
        | Nuxt Reddit Client
      p This app is in EARLY ALPHA, expect bugs and missing features.
      p You have to login to do anything
      p
      .links
        nuxt-link.button--green(to='/login') Login
        a.button--green(
          href='https://github.com/Redusa/Redusa'
          target='_blank'
        )
          i.fa.fa-fw.fa-btn.fa-github
          | Watch us on Github!
        a.button--green(
          href='https://www.reddit.com/r/Redusa'
          target='_blank'
        )
          i.fa.fa-fw.fa-btn.fa-reddit
          | Visit Our Subreddit
</template>

<script>
export default {
  middleware: ['guest'],
};
</script>

<style>
.container.index {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
