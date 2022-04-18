import isObject from 'lodash/isObject';

// sometimes users share the web wrapper instead of the image file
export default function getImgurImageId(input) {
  if (isObject(input)) {
    return getImgurImageId(input.url);
  }
  if (
    input &&
    input.includes &&
    !(input.includes('imgur.com/a/') || input.includes('imgur.com/gallery/'))
  ) {
    imgurImageIdRegEx.lastIndex = 0
    const result = imgurImageIdRegEx.exec(input);
    return (result && result[1]) || null;
  }
  return null;
}

const imgurImageIdRegEx = /https{0,1}:.{2,12}\bimgur\.com\/([a-zA-Z0-9]{4,12})\/{0,1}/gi;
