const headers = {};

/**
 * Dynamically add a default header for every fetch
 * @ignore
 * @param {string} key
 * @param {string} value
 */
export const addDefaultHeader = (key, value) => {
  headers[key] = value;
};

/**
 * Dynamically remove an added default header
 * @ignore
 * @param {string} key
 */
export const removeDefaultHeader = key => {
  delete headers[key];
};

/**
 * Add HTTP headers to every fetch
 * @example
 * import {addDefaultHeader, defaultHeaders} from 'higher-order-fetch/hofs/defaultHeaders'
 *
 * const fetch = defaultHeaders({
 *  "Content-Type": "application/json",
 * })(window.fetch)
 *
 * // assume login success:
 * addDefaultHeader('Authorization', 'Basic Ym9zY236Ym9zY28=')
 *
 * // below request should have 2 headers added from above:
 * fetch('http://example.com/data')
 * .then(response => response.json())
 * .then(data => { ... })
 * @param {object} [_defaultHeaders]
 * @returns {function} a fetch-like function
 */
export const defaultHeaders = (_defaultHeaders = {}) => fetch => (
  input,
  init = {}
) => {
  return fetch(input, {
    ...init,
    headers: mergeWithDefaultHeaders(init.headers, {
      ..._defaultHeaders,
      ...headers
    })
  });
};

function mergeWithDefaultHeaders(initHeaders = {}, defaultHeaders) {
  let headerObj;
  if (initHeaders instanceof Headers) {
    headerObj = initHeaders
      .entries()
      //convert array of entries into object:
      .reduce((acc, val) => ({ ...acc, [val[0]]: val[1] }), {});
  } else {
    headerObj = initHeaders;
  }

  return {
    ...defaultHeaders,
    ...headerObj
  };
}
