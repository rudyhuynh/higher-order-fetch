import { bypassCache } from "./bypassCache";

describe("the fetch created by bypassCacheHOF()", () => {
  test("add random number param to url that has no param", () => {
    const mockFetch = jest.fn();

    const bypassCacheFetch = bypassCache(mockFetch);

    const url = "https://my.url";
    const expectedUrlPattern = new RegExp("\\?_v=\\d\\.\\d+$");

    bypassCacheFetch(url);

    const bypassCacheUrl = mockFetch.mock.calls[0][0];

    expect(expectedUrlPattern.test(bypassCacheUrl)).toBe(true);
  });

  test("add random number param to url that has param(s)", () => {
    const mockFetch = jest.fn();

    const bypassCacheFetch = bypassCache(mockFetch);

    const url = "https://my.url?x=1";
    const expectedUrlPattern = new RegExp("&_v=\\d\\.\\d+$");

    bypassCacheFetch(url);

    const bypassCacheUrl = mockFetch.mock.calls[0][0];

    expect(expectedUrlPattern.test(bypassCacheUrl)).toBe(true);
  });
});
