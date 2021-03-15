import get from 'lodash/get';

export default function getPostGallery(post) {
  const pd = (post && post.data) || post;
  if (!(pd && pd.is_gallery)) return null;
  const gallery_data = get(pd, 'gallery_data.items');
  const media_metadata = pd && pd.media_metadata;
  if (!(gallery_data && typeof gallery_data === 'object')) return null;
  if (!(media_metadata && typeof media_metadata === 'object')) return null;

  const list = [];
  const gallery_len = gallery_data.length;
  for (let i = 0; i < gallery_len; i++) {
    const { id, media_id } = gallery_data[i];
    if (media_metadata[media_id]) {
      list.push(media_metadata[media_id]);
    }
  }
  return { images: list };
}
