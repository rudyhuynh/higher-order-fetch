/**
 * Add random parameter to url for every request to bypass cache. May helpful to deal with caching issue in IE
 * @ignore
 */
export const bypassCache = fetch => (input, init) => {
  let bypassCacheUrl;
  if (input.includes("?")) {
    bypassCacheUrl = input + "&_v=" + Math.random();
  } else {
    bypassCacheUrl = input + "?_v=" + Math.random();
  }
  return fetch(bypassCacheUrl, init);
};
