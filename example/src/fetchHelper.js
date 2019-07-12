import { defaultHeaders } from "higher-order-fetch/hofs/defaultHeaders";
import { onErrorRetry } from "higher-order-fetch/hofs/onErrorRetry";
import { jsonResponse } from "higher-order-fetch/hofs/jsonResponse";
import {
  interceptor,
  addBeforeRequestInterceptor,
  addAfterResonseInterceptor
} from "higher-order-fetch/hofs/interceptor";
import pipe from "higher-order-fetch/utils/pipe";

const fetchHelper = {
  addBeforeRequestInterceptor,
  addAfterResonseInterceptor,
  fetch: pipe(
    onErrorRetry(),
    defaultHeaders({
      "Content-Type": "application/json"
    }),
    jsonResponse(),
    interceptor
  )(window.fetch)
};

export default fetchHelper;
