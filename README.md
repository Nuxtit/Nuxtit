# Nuxtit

[![Build Status](https://travis-ci.com/Nuxtit/Nuxtit.svg?branch=master)](https://travis-ci.com/Nuxtit/Nuxtit)
[![Greenkeeper badge](https://badges.greenkeeper.io/Nuxtit/Nuxtit.svg)](https://greenkeeper.io/)
[![Lighthouse Accessibility](badges/lighthouse_accessibility.svg)](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnuxtit.netlify.com%2F)
[![Lighthouse Best Practices](badges/lighthouse_best-practices.svg)](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnuxtit.netlify.com%2F)
[![Lighthouse Performance](badges/lighthouse_performance.svg)](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnuxtit.netlify.com%2F)
[![Lighthouse PWA](badges/lighthouse_pwa.svg)](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnuxtit.netlify.com%2F)
[![Lighthouse SEO](badges/lighthouse_seo.svg)](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnuxtit.netlify.com%2F)

> Webapp Reddit Client written in Vue/Nuxt

This app has been in alpha for 2+ years, expect minor bugs and missing "last mile" features.

[https://nuxtit.netlify.com](https://nuxtit.netlify.com)

## Build Setup

``` bash
# copy .env and set desired settings
$ cp .env.example .env

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Features

Browse Reddit! We're working to add the majority of basic features to reduce the amount of times you need to leave the app. There is a lot of work left to to do! Most places will have a link allowing you to quickly goto reddit while we still have a lot of work to do. (Update!) We have so many things implemented (voting, commenting, crossposting, mod stuff, etc.) that you should open an issue if you want something specific.
![Browse Reddit](https://i.imgur.com/gY6CJwN.png)

Use settings menu to quickly censor usernames for screenshots. Note that you can tell which two posts were posted by the same user because of the color. Now you don't have to figure out how photoshop works on your phone just to censor usernames (do not get yourself in trouble for doxxing/brigading!). We'll leave the censor usernames feature on for our screenshots.
![Censor Usernames](https://i.imgur.com/EU6M0Ij.png)

Sign into multiple accounts.
![Sign into multiple accounts.](https://user-images.githubusercontent.com/33235178/106799093-d1d62a80-662c-11eb-9133-186b986c1455.png)

Pushshift built-in (also has masstagger)
![Pushshift Search](https://user-images.githubusercontent.com/33235178/106803608-62fbd000-6632-11eb-8540-93b17825cd74.png)

Pushshift comments can optionally be grouped by link_id:
![Pushshift Results](https://user-images.githubusercontent.com/33235178/106803919-b3732d80-6632-11eb-85ac-44a22d3e3ee8.png)

You can search things via reddit search or via pushshift.
![Search](https://i.imgur.com/nxsOM4Y.png)

Tap the thumbnail to see image enlarged under the post.
![Tap Thumbnail](https://i.imgur.com/1Z2L1YU.png)

Support for galleries (sometimes even imgur)
![Reddit Gallery](https://user-images.githubusercontent.com/33235178/106803969-c7b72a80-6632-11eb-96e2-b039ee9597ac.png)

Add things to your "Queue" so you don't have to open 100+ tabs
![Queue1](https://i.imgur.com/y6ePOiC.png)
![Queue2](https://i.imgur.com/D69edw5.png)
