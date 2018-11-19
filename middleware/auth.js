export default async function({ store, redirect }) {
  if (!store.getters['auth/isAuthenticated']) {
    return redirect('/');
  }
}
