# Redusa

[![Build Status](https://travis-ci.com/Redusa/Redusa.svg?branch=master)](https://travis-ci.com/Redusa/Redusa)

> Webapp Reddit Client written in Vue/Nuxt

This app is in EARLY ALPHA, expect bugs and missing features.

[https://redusa.netlify.com](https://redusa.netlify.com)

[Find us on Reddit](https://old.reddit.com/r/Redusa/)

## Build Setup

``` bash
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

Browse Reddit! We're working to add the majority of basic features to reduce the amount of times you need to leave the app. There is a lot of work left to to do! Most places will have a link allowing you to quickly goto reddit while we still have a lot of work to do.
![Browse Reddit](https://i.imgur.com/gY6CJwN.png)

Use settings menu to quickly censor usernames for screenshots. Note that you can tell which two posts were posted by the same user because of the color. Now you don't have to figure out how photoshop works on your phone just to censor usernames (do not get yourself in trouble for doxxing/brigading!). We'll leave the censor usernames feature on for our screenshots.
![Censor Usernames](https://i.imgur.com/EU6M0Ij.png)

Visit a user profile and click "Karma Table" to see a karma table of their most recent 100 activities. You can also see a table for the next 100. One day you'll be able to see more than 100, although 100 is the maximum for that reddit API call ATM.
![Karma Table](https://i.imgur.com/0ZbybFj.png)

You can search things.
![Search](https://i.imgur.com/nxsOM4Y.png)

Tap the thumbnail to see image enlarged under the post.
![Tap Thumbnail](https://i.imgur.com/1Z2L1YU.png)

Add things to your "Queue" so you don't have to open 100+ tabs
![Queue1](https://i.imgur.com/y6ePOiC.png)
![Queue2](https://i.imgur.com/D69edw5.png)
