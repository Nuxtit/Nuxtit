import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';

export default function getPostPhotos(post) {
  const { photos } = post;
  return map(post.photos, p => ({
    href: get(p, 'original_size.url'),
    thumbnail: get(find(p.alt_sizes, p => p.width <= 250), 'url'),
  }));
}
