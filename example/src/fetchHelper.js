import { defaultHeadersHOF } from "higher-order-fetch/lib/defaultHeaders";
import { onErrorRetryHOF } from "higher-order-fetch/lib/onErrorRetry";
import { myHOF } from "./myHOF";
import pipe from "higher-order-fetch/lib/utils/pipe";

const fetchHelper = {
  fetch: pipe(
    onErrorRetryHOF,
    defaultHeadersHOF({
      "Content-Type": "application/json"
    }),
    myHOF
  )(window.fetch)
};

export default fetchHelper;
