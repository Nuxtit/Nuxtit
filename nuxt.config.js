require('dotenv').load();
const pkg = require('./package');

module.exports = {
  server: {
    port: 10080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/bootstrap-darkly.min.css' },
      // @todo http://fontello.com/
      { rel: 'stylesheet', href: '/css/font-awesome-4.7.0/css/font-awesome.min.css' },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    // '~/assets/bootstrap-darkly.min.css',
    // '~/assets/font-awesome-4.7.0/css/font-awesome.min.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/directives',
    '~/plugins/reddit',
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    // 'bootstrap-vue/nuxt',
    // '@nuxtjs/sentry',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },

  env: {
    redditClientId: process.env.REDDIT_CLIENT_ID,
    // if there is a secret key, then we're not in production
    // if there is not a secret key, we need the correct OAuth stuff
    redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
    redditRedirectUri: process.env.REDDIT_REDIRECT_URI || 'http://127.0.0.1:10080/auth/reddit/callback',
  },

  // sentry: {
  //   public_key: '',
  //   project_id: '',
  //   config: {
  //     // Additional config
  //   },
  // },
};
