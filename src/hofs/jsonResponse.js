/**
 * Implicitly parse response to json. The fetch created by this will resolve an array of [jsonData, statusCode]
 * @example
 * import {jsonResponse} from 'higher-order-fetch/hofs/jsonResponse'
 * const fetch = jsonResponse()(window.fetch)
 *
 * fetch('http://example.com/data')
 * .then(([data, status]) => {// no need to call `response.json()` here
 * // `data` is a JSON object only if fetch data success with JSON data,
 * // otherwise, it is either a Response or an Error.
 * // `status` is either HTTP Status Code or `undefined` if fetch fail.
 * })
 *
 * @param {boolean} suppressWarning If true, no error will be logged when request error or parse JSON fail.
 * @returns {function} a fetch-like function
 */
export const jsonResponse = (suppressWarning = false) => fetch => async (
  ...fetchParams
) => {
  let response;
  try {
    response = await fetch(...fetchParams);
    const json = await response.json();
    return [json, response.status];
  } catch (e) {
    !suppressWarning && console.warn(e);
    return response ? [response, response.status] : [e, undefined];
  }
};
