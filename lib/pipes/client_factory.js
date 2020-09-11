const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');

// stats_path: should return Array(Object{pipe: String, count: Int})
// items_path should return objects with one of these properties (saved_at, score, id, pipe)
// id should be the prefixed "name" aka t1_ or t3_
// I have no intent to support the "realtime" options of the API
// but will accept PRs if others want it to work.
export default function({ api_url, stats_path, items_path }) {
  const client = feathers();

  // Connect to a different URL
  const restClient = rest(api_url);

  // Configure an AJAX library (see below) with that client
  client.configure(restClient.fetch(window.fetch));

  // Connect to the `http://feathers-api.com/messages` service
  // const messages = client.service('messages');

  return {
    client,
    stats: client.service(stats_path),
    items: items_path ? client.service(items_path) : null,
  };
}
