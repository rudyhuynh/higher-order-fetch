# HIGHER-ORDER FETCH

Using `window.fetch()` with some handful composable logic.

## Why you need this

See [my article here](https://medium.com/@rudy.huynh286/higher-order-fetch-a-clean-way-to-enhance-fetch-method-21fc2765f76).

tldr;

This library provides a set of handful `fetch` enhancement as well as gives you the idea to create a `fetch` method that:

- Fetch data from server, of course
- Enhanced but remained the familiarity of [the Fetch API that documented and provided by the browsers](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), so that everyone can quickly understand and use it.
- The enhancement can be easily managed, opt in or out depend on the need of your project.

## Installation

```
npm install higher-order-fetch
```

or

```
yarn add higher-order-fetch
```

## How to use

Step 1: Compose your fetch:

```js
// fetchHelper.js
import { defaultHeadersHOF } from "higher-order-fetch/lib/defaultHeaders";
import { onErrorRetryHOF } from "higher-order-fetch/lib/onErrorRetry";
import { myHOF } from "./myHOF";
import pipe from "higher-order-fetch/lib/utils/pipe";

const fetchHelper = {
  fetch: pipe(
    onErrorRetryHOF,
    defaultHeadersHOF,
    myHOF
  )(window.fetch)
};
export default fetchHelper;
```

Step 2: Use it

```js
// somewhere-that-need-to-fetch-data.js
import fetchHelper from "./path/to/fetchHelper.js";

fetchHelper.fetch("http://my.url/data").then(/* ... */);
```

## Example

Checkout [the example](https://github.com/rudyhuynh/higher-order-fetch/tree/master/example) for a recommended fetch setup and usage

## API

[https://rudyhuynh.github.io/higher-order-fetch](https://rudyhuynh.github.io/higher-order-fetch)

## LISCENE

MIT
