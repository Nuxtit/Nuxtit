export default async function({ route, store }) {
  store.dispatch('history/add', route);
}
