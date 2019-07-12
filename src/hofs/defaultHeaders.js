const headers = {};

export const addDefaultHeader = (key, value) => {
  headers[key] = value;
};

export const removeDefaultHeader = key => {
  delete headers[key];
};

/**
 * Add default headers]
 * @example
 * import {addDefaultHeader, defaultHeaders} from 'higher-order-fetch/hofs/defaultHeaders'
 *
 * const fetch = defaultHeaders({
 *  "Content-Type": "application/json",
 * })(window.fetch)
 *
 * // called after login success:
 * addDefaultHeader('Authorization', 'Basic Ym9zY236Ym9zY28=')
 *
 * // below request should have 2 headers added from above:
 * fetch('http://example.com/data')
 * .then(response => response.json())
 * .then(data => { ... })
 * @param {object} [defaultHeaders]
 * @returns {function} a fetch-like function
 */
export const defaultHeaders = (defaultHeaders = {}) => fetch => (
  input,
  init = {}
) => {
  return fetch(input, {
    ...init,
    headers: mergeWithDefaultHeaders(init.headers, {
      ...defaultHeaders,
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
