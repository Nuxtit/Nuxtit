const TumblrFactory = require('tumblr.js');

exports.handler = function(event, context, callback) {
  if (event.httpMethod !== 'POST') return callback(null, { statusCode: 405 });
  // your server-side functionality
  // console.log('createLinkPost:yay');
  // console.log(event.body);

  const body = JSON.parse(event.body);

  const tumblr = TumblrFactory.createClient({
    consumer_key: body.consumer_key,
    consumer_secret: body.consumer_secret,
    token: body.token,
    token_secret: body.token_secret,
  });

  tumblr.createLinkPost(body.blogName, body.options || {}, function(
    err,
    data,
    response,
  ) {
    // console.log({ err, data, response });
    if (err) {
      if (response && response.statusCode) {
        callback(null, response);
        return;
      }
      callback(err);
      return;
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  });
};
