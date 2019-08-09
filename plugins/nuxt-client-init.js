import now from '~/lib/now';

const INTERVAL_MS = 30000; // ms

const TWO_MINUTES = 120; // seconds

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
  if (ctx.store.state.windowActive) {
    const lastFetchedAt = ctx.store.getters['auth/fetchedAt'];
    if (!lastFetchedAt || now() > lastFetchedAt + TWO_MINUTES) {
      await ctx.store.dispatch('auth/fetchMe');
    }
  }
}
