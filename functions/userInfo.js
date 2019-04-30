const TumblrFactory = require('tumblr.js');

exports.handler = function(event, context, callback) {
  if (event.httpMethod !== 'POST') return callback(null, { statusCode: 405 });
  // your server-side functionality
  console.log('userInfo:yay');
  console.log(event.body);

  const body = JSON.parse(event.body);

  const tumblr = TumblrFactory.createClient({
    consumer_key: body.consumer_key,
    consumer_secret: body.consumer_secret,
    token: body.token,
    token_secret: body.token_secret,
  });

  tumblr.userInfo(function(err, data) {
    if (err) {
      return callback(err);
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  });
};
