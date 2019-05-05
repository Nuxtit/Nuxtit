require('dotenv').load();
const pkg = require('./package');

/* eslint-disable */
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
    title: 'Redusa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'apple-mobile-web-app-title', content: 'Redusa' },
      { name: 'application-name', content: 'Redusa' },
      { name: 'msapplication-TileColor', content: '#2b5797' },
      { name: 'theme-color', content: '#444444' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/bootstrap-darkly.min.css' },
      // @todo http://fontello.com/
      { rel: 'stylesheet', href: '/css/font-awesome-4.7.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: '/css/more_dark.css' },

      { rel: 'apple-touch-iconicon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
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
    ['@nuxtjs/google-analytics', {
      id: 'UA-97423-2'
    }],
    '@nuxtjs/sentry',
    // Doc: https://github.com/nuxt-community/axios-module#usage
    // '@nuxtjs/axios',
    // ['@nuxtjs/proxy', {
    //   '/masstagger': {
    //     pathRewrite: { '^/masstagger' : '' },
    //     target: 'https://masstagger.com',
    //     ws: false,
    //   },
    // }],
    '@nuxtjs/proxy',
  ],

  proxy: {
    '/masstagger': {
      pathRewrite: { '^/masstagger' : '' },
      target: 'https://masstagger.com',
      ws: false,
    },
    '/api-pushshift': {
      pathRewrite: { '^/api-pushshift' : '' },
      target: 'https://api.pushshift.io',
      ws: false,
    },
    '/.netlify/functions': {
      pathRewrite: { '^/.netlify/functions/' : '' },
      // target: 'https://api.tumblr.com/v2',
      target: 'http://127.0.0.1:9000',
      ws: false,
    },
  },

  /*
  ** Build configuration
  */
  build: {

    splitChunks: {
      layouts: false,
      pages: false,
      commons: false,
    },

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

      config.output.globalObject = 'this';
      // config.output.globalObject = `typeof self !== 'undefined' ? self : this`;
    },
  },

  env: {
    redditClientId: process.env.REDDIT_CLIENT_ID,
    // if there is a secret key, then we're not in production
    // if there is not a secret key, we need the correct OAuth stuff
    // redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
    redditRedirectUri: process.env.REDDIT_REDIRECT_URI ||
      'http://127.0.0.1:10080/auth/reddit/callback',
  },

  sentry: {
    // @link https://docs.sentry.io/clients/javascript/config/
    public_key: process.env.SENTRY_DSN,
    config: {
      // Additional config
      release: '0.0.0',
    },
  },

  router: {
    middleware: ['redirects', 'history'],
  },
};
