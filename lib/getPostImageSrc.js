import get from 'lodash/get';
import find from 'lodash/find';
import getPostGallery from '~/lib/getPostGallery';
import isValidImageSrc from '~/lib/isValidImageSrc';

export default function getPostImageSrc(post) {
  if (!post) return null;
  let src;
  let path;

  // full images: last to first
  const srcPaths = [
    'url',
    'thumbnail',
    // @todo should we attempt to embed videos?
    // 'preview.images.0.variants.mp4.source.url',
    'preview.images.0.variants.gif.source.url',
    'preview.images.0.resolutions.' +
      (get(post, 'preview.images.0.resolutions.length', 1) - 1) +
      '.url',
    'preview.images.0.source.url',

    'crosspost_parent_list.0.preview.images.0.variants.gif.source.url',
    'crosspost_parent_list.0.preview.images.0.resolutions.' +
      (get(post, 'preview.images.0.resolutions.length', 1) - 1) +
      '.url',
    'crosspost_parent_list.0.preview.images.0.source.url',
  ];

  if (post.is_self) {
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
    if (post.crosspost_parent_list && post.crosspost_parent_list.length > 0) {
      for (let i = 0, len = srcPaths.length; i < len; i++) {
        path = 'crosspost_parent_list.0.' + srcPaths[i];
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
