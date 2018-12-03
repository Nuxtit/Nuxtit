import { fetchTags } from '~/lib/worker/masstagger';

// console.log('mtw/sharedworker.js');

self.onconnect = connectionEvent => {
  // console.log("static/sharedworker.js", "connect", event);

  let port = connectionEvent.ports[0];

  port.onmessage = async event => {
    // console.log(
    //   'static/sharedworker.js',
    //   'Message received by worker is...',
    //   event,
    // );

    if (event.data) {
      if (event.data.fetchTags) {
        await fetchTags(event, port);
      }
    }
  };
};
