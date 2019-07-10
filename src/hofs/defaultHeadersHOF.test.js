import {
  defaultHeadersHOF,
  mergeWithDefaultHeaders
} from "./defaultHeadersHOF";

const defaultHeaders = {
  "Content-Type": "application/json"
};

defaultHeadersHOF = defaultHeadersHOF(defaultHeaders);

describe("defaultHeadersHOF(fetch)", () => {
  test("should return a fetch that merge with default headers", async () => {
    const url = "https://my.url";
    const init = {
      headers: {
        Accept: "*"
      }
    };
    const response = "response";
    const mockFetch = jest.fn(() => new Promise(resolve => resolve(response)));

    const defaultHeadersFetch = defaultHeadersHOF(mockFetch);

    const testedResponse = await defaultHeadersFetch(url, init);

    expect(testedResponse).toBe(response);
    expect(mockFetch.mock.calls[0][1].headers).toEqual({
      ...defaultHeaders,
      ...init.headers
    });
  });
});

describe("mergeWithDefaultHeaders()", () => {
  test("merge when init headers is just object", () => {
    const initHeader = { x: 1, y: 1 };
    const defaultHeaders = { y: 2, z: 3 };
    const result = mergeWithDefaultHeaders(initHeader, defaultHeaders);
    expect(result).toEqual({ x: 1, y: 1, z: 3 });
  });

  test("merge when init headers is instant of Headers", () => {
    const initHeader = new global.Headers({ x: 1, y: 1 });
    const defaultHeaders = { y: 2, z: 3 };
    const result = mergeWithDefaultHeaders(initHeader, defaultHeaders);
    expect(result).toEqual({ x: 1, y: 1, z: 3 });
  });
});
