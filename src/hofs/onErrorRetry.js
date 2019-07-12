import { defer, from, throwError, of } from "rxjs";
import { retryWhen, mergeMap, delay } from "rxjs/operators";

const defaultOptions = { maxRetry: 3, delayMs: 500 };

const get = (obj, field, defaultValue) => (obj || {})[field] || defaultValue;

/**
 * Creat a fetch which retries when:
 * + GET with 5XX error
 * + Network error
 *
 * Before import this, you have to install `rxjs` to your project:
 * ```
 * npm install rxjs
 * ```
 * @requires `rxjs`
 * @example
 * import {onErrorRetry} from 'higher-order-fetch/hofs/onErrorRetry'
 *
 * const fetch = onErrorRetry({
 *  maxRetry: 5,
 *  delayMs: 3000
 * })(window.fetch)
 *
 * fetch('http://example.com')// if request error, will retry maximum 5 times before resolve
 * .then(response => {
 *  // `response` is the last response after all retries or success.
 * })
 * @param {{maxRetry: number, delayMs: number}} [options]
 * @returns {function} a fetch-like function
 */
export const onErrorRetry = options => fetch => (input, init = {}) => {
  const maxRetry = get(options, "maxRetry", defaultOptions.maxRetry);
  const delayMs = get(options, "delayMs", defaultOptions.delayMs);

  if (!init.method || init.method.toUpperCase() === "GET") {
    let count = 0;
    return defer(() => {
      return from(
        fetch(input, init).then(resp => {
          if ((resp.status + "").startsWith("5")) throw resp;
          return resp;
        })
      );
    })
      .pipe(
        retryWhen(errors => {
          return errors.pipe(
            mergeMap(error => {
              if (++count >= maxRetry) {
                return throwError(error);
              } else {
                return of(error).pipe(delay(delayMs));
              }
            })
          );
        })
      )
      .toPromise()
      .then(
        resp => resp,
        resp => {
          if (resp.status === 500) return resp;
          throw resp;
        }
      );
  }
  return fetch(input, init);
};
