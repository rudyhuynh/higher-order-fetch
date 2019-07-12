/**
 * Log request and response.
 * @param {function} customLog Your custom logger
 * @returns {function} A fetch-like function
 */
export const logger = (customLog = console.log) => fetch => async (
  resource,
  init
) => {
  if (resource instanceof Request) {
    customLog(resource.method + " " + resource.url);
  } else {
    const method = init ? init.method || "GET" : "GET";
    customLog(method + " " + resource);
  }
  const response = await fetch(resource, init);

  customLog("\t Status " + response.status, response);

  return response;
};
