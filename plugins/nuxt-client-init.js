import * as RedusaSharedWorker from 'shared-worker-loader!~/lib/worker/shared';

const INTERVAL_MS = 5 * 60000;

export default async ctx => {
  if ('SharedWorker' in window) {
    // ctx.masstagger = new SharedWorker('/masstagger.js');
    // ctx.masstagger.port.start();
    ctx.sharedWorker = new RedusaSharedWorker();
    // ctx.masstagger.port.start();
    ctx.sharedWorker.port.onmessage = event => {
      // console.log('masstagger.message', event);
      if (event.data.fetchedTags) {
        ctx.store.commit('masstagger/merge', event.data.fetchedTags);
      }
    };
  }

  await ctx.store.dispatch('nuxtClientInit', ctx);

  setInterval(onInterval, INTERVAL_MS, ctx);

  window.onfocus = () => {
    if (!ctx.store.state.windowActive) {
      ctx.store.commit('windowActive', true);
    }
  };
  window.onblur = () => {
    if (ctx.store.state.windowActive) {
      ctx.store.commit('windowActive', false);
    }
  };
};

async function onInterval(ctx) {
  await ctx.store.dispatch('auth/fetchMe');
}
