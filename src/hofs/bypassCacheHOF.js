/**
 * Create a fetch which bypass cache
 */
export const bypassCacheHOF = fetch => (input, init) => {
  let bypassCacheUrl;
  if (input.includes("?")) {
    bypassCacheUrl = input + "&_v=" + Math.random();
  } else {
    bypassCacheUrl = input + "?_v=" + Math.random();
  }
  return fetch(bypassCacheUrl, init);
};
