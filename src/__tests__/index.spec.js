import { composedHOF } from "../index";

test("the final fetch just run", async () => {
  const expectedResponse = { status: 200 };
  const mockFetch = jest.fn(
    () => new Promise(resolve => resolve(expectedResponse))
  );

  const composedFetch = composedHOF(mockFetch);

  const actualResponse = await composedFetch("http://my.url");
  expect(actualResponse).toBe(expectedResponse);
});
