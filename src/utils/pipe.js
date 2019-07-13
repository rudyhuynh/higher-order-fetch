/**
 * Use this to create your fetch method by pipe multiple higher-order `fetch`es.
 * @see https://medium.com/free-code-camp/pipe-and-compose-in-javascript-5b04004ac937
 * @see https://github.com/rudyhuynh/higher-order-fetch/blob/master/example/src/fetchHelper.js
 * @example
 * import pipe from 'higher-order-fetch/utils/pipe'
 *
 * const doThis = fetch => (...fetchParams) => {
 *  // [do this stuff...]
 *  return fetch(...fetchParams)
 * }
 * const doThat = fetch => async (...fetchParams) => {
 *  const response = await fetch(...fetchParams)
 *  // [do that stuff...]
 *  return response
 * }
 *
 * const fetch = pipe(
 *  doThis,
 *  doThat
 * )(window.fetch)
 *
 * fetch('http://example.com/data').then(response => {...})
 * @param  {...function} fns
 *
 */
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
export default pipe;
