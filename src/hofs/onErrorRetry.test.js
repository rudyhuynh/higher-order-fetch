import { onErrorRetry, MAX_RETRY } from "./onErrorRetryHOF";

describe("on5XXErrorRetryHOF(fetch)", () => {
  test("NOT retry when HTTP method is NOT GET", async () => {
    const expectErrorResponse = { status: 500 };
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          resolve(expectErrorResponse);
        })
    );
    const onErrorRetryFetch = onErrorRetry(mockFetch);

    const actualResponse = await onErrorRetryFetch("http://my.url", {
      method: "POST"
    });

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(actualResponse).toEqual(expectErrorResponse);
  });

  test("retry and fail after MAX_RETRY times with 500 error", async () => {
    const expectErrorResponse = { status: 500 };
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          resolve(expectErrorResponse);
        })
    );

    const onErrorRetryFetch = onErrorRetry(mockFetch);

    const actualResponse = await onErrorRetryFetch("http://my.url");

    expect(mockFetch.mock.calls.length).toBe(MAX_RETRY);
    expect(actualResponse).toEqual(expectErrorResponse);
  });

  test("retry and fail after MAX_RETRY times with network error", async () => {
    const networkError = "network error";
    const mockFetch = jest.fn(
      () =>
        new Promise(() => {
          throw networkError;
        })
    );

    const onErrorRetryFetch = onErrorRetry(mockFetch);

    try {
      await onErrorRetryFetch("http://my.url");
    } catch (e) {
      expect(e).toBe(networkError);
    }

    expect(mockFetch.mock.calls.length).toBe(MAX_RETRY);
  });

  test("retry 5XX error and success", async () => {
    const errorResponse = { status: 500 };
    const expectedSuccessResponse = { status: 200 };
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          if (mockFetch.mock.calls.length === 1) {
            resolve(errorResponse);
          } else if (mockFetch.mock.calls.length === 2) {
            resolve(expectedSuccessResponse);
          }
        })
    );

    const onErrorRetryFetch = onErrorRetry(mockFetch);

    const actualResponse = await onErrorRetryFetch("http://my.url");

    expect(mockFetch.mock.calls.length).toBe(2);
    expect(actualResponse).toEqual(expectedSuccessResponse);
  });

  test("retry network error and success", async () => {
    const networkError = "network error";
    const expectedSuccessResponse = { status: 200 };
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          if (mockFetch.mock.calls.length === 1) {
            throw networkError;
          } else if (mockFetch.mock.calls.length === 2) {
            resolve(expectedSuccessResponse);
          }
        })
    );

    const onErrorRetryFetch = onErrorRetry(mockFetch);

    const actualResponse = await onErrorRetryFetch("http://my.url");

    expect(mockFetch.mock.calls.length).toBe(2);
    expect(actualResponse).toEqual(expectedSuccessResponse);
  });

  test("retry and get NONE 5XX error", async () => {
    const errorResponse = { status: 500 };
    const expectedNone5XXResponse = { status: 401 };
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          if (mockFetch.mock.calls.length === 1) {
            resolve(errorResponse);
          } else if (mockFetch.mock.calls.length === 2) {
            resolve(expectedNone5XXResponse);
          }
        })
    );

    const onErrorRetryFetch = onErrorRetry(mockFetch);

    const actualResponse = await onErrorRetryFetch("http://my.url");

    expect(mockFetch.mock.calls.length).toBe(2);
    expect(actualResponse).toEqual(expectedNone5XXResponse);
  });
});
