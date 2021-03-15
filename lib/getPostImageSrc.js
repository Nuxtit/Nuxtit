import get from 'lodash/get';
import find from 'lodash/find';
import getPostGallery from '~/lib/getPostGallery';
import isValidImageSrc from '~/lib/isValidImageSrc';

export default function getPostImageSrc(post) {
  if (!post && post.data) return null;
  let src;
  let path;

  // full images: last to first
  const srcPaths = [
    'data.thumbnail',
    // @todo should we attempt to embed videos?
    // 'data.preview.images.0.variants.mp4.source.url',
    'data.preview.images.0.variants.gif.source.url',
    'data.preview.images.0.resolutions.' +
      (get(post, 'data.preview.images.0.resolutions.length', 1) - 1) +
      '.url',
    'data.preview.images.0.source.url',

    'data.crosspost_parent_list.0.preview.images.0.variants.gif.source.url',
    'data.crosspost_parent_list.0.preview.images.0.resolutions.' +
      (get(post, 'data.preview.images.0.resolutions.length', 1) - 1) +
      '.url',
    'data.crosspost_parent_list.0.preview.images.0.source.url',
    // 'data.url',
  ];

  if (post.data.is_self) {
    // maybe ?
    const album = getPostGallery(post);
    const entry = find(album && album.images, firstValidImage);
    if (entry && entry.s && entry.s.u && isValidImageSrc(entry.s.u)) {
      return entry.s.u;
    }
  } else {
    srcPaths.push('url');
  }

  if (post) {
    for (let i = srcPaths.length - 1; i >= 0; i--) {
      // for (let i = 0, len = srcPaths.length; i < len; i++) {
      path = srcPaths[i];
      src = get(post, path);
      if (isValidImageSrc(src)) {
        return src;
      }
    }
    if (
      post.data.crosspost_parent_list &&
      post.data.crosspost_parent_list.length > 0
    ) {
      for (let i = 0, len = srcPaths.length; i < len; i++) {
        path = 'data.crosspost_parent_list.0.' + srcPaths[i];
        src = get(post, path);
        if (isValidImageSrc(src)) {
          return src;
        }
      }
    }
  }
  return null;
}

function firstValidImage(entry) {
  return entry && entry.status === 'valid' && entry.e === 'Image';
}
