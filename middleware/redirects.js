export default async function({ route, redirect }) {
  if (route.path.startsWith('/u/')) {
    redirect(route.fullPath.replace('/u/', '/user/'));
  }
}
