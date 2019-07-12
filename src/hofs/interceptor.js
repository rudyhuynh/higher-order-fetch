const beforeRequestInterceptors = [];
const afterResponseInterceptors = [];

/**
 * Manage interceptors - to do something before or after every fetch.
 * Use this with {@link addBeforeRequestInterceptor()} and {@link addAfterResonseInterceptor()}
 * @example
 * import {
 *  addBeforeRequestInterceptor,
 *  addAfterResonseInterceptor,
 *  interceptor
 * } from 'higher-order-fetch/hofs/interceptor'
 *
 * const fetch = interceptor()(window.fetch)
 *
 * addBeforeRequestInterceptor(() => {
 *  Loader.show()
 * })
 * addAfterResonseInterceptor(() => {
 *  Loader.hide()
 * })
 *
 * fetch('http://my.url/data')
 * .then(response => response.json())
 * .then(data => {...})
 */
export const interceptor = () => fetch => async (resource, init) => {
  //run interceptors before each request
  let beforeRequestInterceptorsResult = applyBeforeRequestInterceptors(
    beforeRequestInterceptors
  );
  if (beforeRequestInterceptorsResult === false) {
    throw new Error(
      "Fetch Promise was canceled by interceptor before requested"
    );
  }

  const response = await fetch(resource, init);

  // run interceptors after each requests
  let afterResponseInterceptorsResult = applyAfterResponseInterceptors(
    response,
    afterResponseInterceptors
  );
  if (afterResponseInterceptorsResult === false) {
    throw new Error(
      "Fetch Promise was canceled by interceptor after responded"
    );
  }

  return response;
};

/**
 * To define something to do before every fetch request.<br/>
 * If any interceptor returns false, the process will be stop immediately.<br/>
 * Only work with {@link interceptor}
 * @param {function} interceptor callback that will be called before every request
 * @returns {function} Callback to remove added interceptor
 */
export function addBeforeRequestInterceptor(interceptor) {
  beforeRequestInterceptors.push(interceptor);
  return () => {
    const index = beforeRequestInterceptors.indexOf(interceptor);
    beforeRequestInterceptors.splice(index, 1);
  };
}

/**
 * To define something to do after every fetch response.<br/>
 * If any interceptor returns false, the process will be stop immediately.<br/>
 * Only work with {@link interceptor}
 * @param {function} interceptor callback that will be called after every response
 */
export function addAfterResonseInterceptor(interceptor) {
  afterResponseInterceptors.push(interceptor);
  return () => {
    const index = afterResponseInterceptors.indexOf(interceptor);
    afterResponseInterceptors.splice(index, 1);
  };
}

function applyBeforeRequestInterceptors(interceptors) {
  interceptors.forEach(interceptor => {
    try {
      const interceptorResult = interceptor();
      if (interceptorResult === false) {
        console.error(
          "Interceptor ",
          interceptor,
          " has cancel signal. This makes the request stop immediately."
        );
        return false;
      }
    } catch (e) {
      console.error(`Error from interceptor ${interceptor}`, e);
      return false;
    }
  });
}

function applyAfterResponseInterceptors(response, interceptors) {
  interceptors.forEach(interceptor => {
    try {
      const interceptorResult = interceptor(response);
      if (interceptorResult === false) {
        console.error(
          "Interceptor ",
          interceptor,
          " has cancel signal. This makes the request stop immediately."
        );
        return false;
      }
    } catch (e) {
      console.error(`Error from interceptor ${interceptor}`, e);
      return false;
    }
  });
}
