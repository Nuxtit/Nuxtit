import get from 'lodash/get';
import isValidImageSrc from '~/lib/isValidImageSrc';

// thumbnails: first to last
const srcPaths = [
  'thumbnail',
  // @todo should we attempt to embed videos?
  // 'preview.images.0.variants.mp4.source.url',
  // 'preview.images.0.variants.gif.source.url',
  'preview.images.0.resolutions.0.url',
  'preview.images.0.source.url',
];

export default function getPostThumbnailSrc(post) {
  let src;
  let path;

  if (post) {
    for (let i = 0, len = srcPaths.length; i < len; i++) {
      path = srcPaths[i];
      src = get(post.data, path);
      if (isValidImageSrc(src)) {
        return src;
      }
    }
    if (
      post.data.crosspost_parent_list &&
      post.data.crosspost_parent_list.length > 0
    ) {
      for (let i = 0, len = srcPaths.length; i < len; i++) {
        path = 'crosspost_parent_list.0.' + srcPaths[i];
        src = get(post, path);
        if (isValidImageSrc(src)) {
          return src;
        }
      }
    }
  }
  // if (!post.data.is_self) {
  //   if (isValidImageSrc(post.data.url)) {
  //     return post.data.url;
  //   }
  // }
  return null;
}
