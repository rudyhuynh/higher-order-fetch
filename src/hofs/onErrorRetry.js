import { defer, from, throwError, of } from "rxjs";
import { retryWhen, mergeMap, delay } from "rxjs/operators";

const defaultOptions = { maxRetry: 3, maxDelay: 500 };

const get = (obj, field, defaultValue) => (obj || {})[field] || defaultValue;

/**
 * NOTE: This requires `rxjs` as peer dependency.
 * Creat a fetch which retries when:
 * + GET with 5XX error
 * + Network error
 * @param {*} fetch
 */
export const onErrorRetry = options => fetch => (input, init = {}) => {
  const maxRetry = get(options, "maxRetry", defaultOptions.maxRetry);
  const maxDelay = get(options, "maxDelay", defaultOptions.maxDelay);

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
                return of(error).pipe(delay(maxDelay));
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
