const INTERVAL_MS = 5 * 60000;

export default async ctx => {
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
  console.log('onInterval');
  await ctx.store.dispatch('fetchMe');
}
