const beforeRequestInterceptors = [];
const afterResponseInterceptors = [];

/**
 * To define something to do before every fetch request.
 * If any interceptor returns false, the process will be stop immediately.
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
 * To define something to do after every fetch response.
 * If any interceptor returns false, the process will be stop immediately.
 * @param {function} interceptor callback that will be called after every response
 */
export function addAfterResonseInterceptor(interceptor) {
  afterResponseInterceptors.push(interceptor);
  return () => {
    const index = afterResponseInterceptors.indexOf(interceptor);
    afterResponseInterceptors.splice(index, 1);
  };
}

export const interceptor = fetch => async (resource, init) => {
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
