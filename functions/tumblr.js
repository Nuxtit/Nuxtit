const TumblrFactory = require('tumblr.js');

const apiCalls = {};

exports.handler = function(event, context, callback) {
  if (event.httpMethod !== 'POST') return callback(null, { statusCode: 405 });
  // your server-side functionality
  // console.log('blogPosts:yay');
  // console.log(event.body);

  const body = JSON.parse(event.body);

  if (!body.apiCall) return callback(null, { statusCode: 405 });
  if (!apiCalls[body.apiCall]) return callback(null, { statusCode: 405 });

  const tumblr = TumblrFactory.createClient({
    consumer_key: body.consumer_key,
    consumer_secret: body.consumer_secret,
    token: body.token,
    token_secret: body.token_secret,
  });
  apiCalls[body.apiCall].fn(tumblr, body, callback);
};

const apiArgs = {
  blogNameOptions(tumblr, body, callback) {
    tumblr[body.apiCall](
      body.blogName,
      body.options || {},
      forwardResponse(callback),
    );
  },
  options(tumblr, body, callback) {
    tumblr[body.apiCall](body.blogName, forwardResponse(callback));
  },
  idReblogKey(tumblr, body, callback) {
    tumblr[body.apiCall](body.id, body.reblogKey, forwardResponse(callback));
  },
  none(tumblr, callback) {
    tumblr[body.apiCall](forwardResponse(callback));
  },
};

Object.assign(apiCalls, {
  userInfo: { fn: apiArgs.none },
  userDashboard: { fn: apiArgs.blogNameOptions },
  blogDrafts: { fn: apiArgs.blogNameOptions },
  blogQueue: { fn: apiArgs.blogNameOptions },
  blogPosts: { fn: apiArgs.blogNameOptions },
  blogSubmissions: { fn: apiArgs.blogNameOptions },
  createLinkPost: { fn: apiArgs.blogNameOptions },
  createPhotoPost: { fn: apiArgs.blogNameOptions },
  createTextPost: { fn: apiArgs.blogNameOptions },
  createVideoPost: { fn: apiArgs.blogNameOptions },
  deletePost: { fn: apiArgs.blogNameOptions },
  reblogPost: { fn: apiArgs.blogNameOptions },
  likePost: { fn: apiArgs.idReblogKey },
  unlikePost: { fn: apiArgs.idReblogKey },
  editPost: { fn: apiArgs.blogNameOptions },
});

function forwardResponse(callback) {
  return function forwardResponseInner(err, data, response) {
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
  };
}
