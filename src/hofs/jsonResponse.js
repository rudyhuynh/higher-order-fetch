/**
 * Make a fetch that return an array of `[jsonData, statusCode]`
 * Example:
 * ```js
 * const fetch = jsonResponse()(window.fetch)
 * const [data, status] = await fetch('http://example.com/data')
 * // `data` is a JSON object only if fetch data success with JSON data, otherwise, it is either a Response or an Error.
 * // `status` is either HTTP Status Code or -1 if fetch fail.
 * ```
 * @param {boolean} suppressWarning default is false, if true, no error will be logged when request or parse JSON fail.
 * @returns {function} a fetch-like function
 */
export const jsonResponse = (suppressWarning = false) => fetch => async (
  resource,
  init
) => {
  let response;
  try {
    response = await fetch(resource, init);
    const json = await response.json();
    return [json, response.status];
  } catch (e) {
    !suppressWarning && console.warn(e);
    return response ? [response, response.status] : [e, -1];
  }
};
