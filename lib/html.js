const CONTENT_TYPE = 'text/html';

export function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, CONTENT_TYPE);
  return doc.documentElement.textContent;
}
