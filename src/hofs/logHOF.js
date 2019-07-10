export const logHOF = (logger = console.log) => fetch => async (
  resource,
  init
) => {
  if (resource instanceof Request) {
    logger(resource.method + " " + resource.url);
  } else {
    const method = init ? init.method || "GET" : "GET";
    logger(method + " " + resource);
  }
  const response = await fetch(resource, init);

  logger("\t Status " + response.status);

  return response;
};
