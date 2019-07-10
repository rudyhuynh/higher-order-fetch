import { defer, from, throwError, of } from "rxjs";
import { retryWhen, mergeMap, delay } from "rxjs/operators";

// TODO - use pipe

export const MAX_RETRY = 3;
const RETRY_DELAY = 500;
/**
 * NOTE: This requires `rxjs` as peer dependency.
 * Creat a fetch which retries when:
 * + GET with 500 error
 * + Network error
 * @param {*} fetch
 */
export const onErrorRetryHOF = fetch => (input, init = {}) => {
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
              if (++count >= MAX_RETRY) {
                return throwError(error);
              } else {
                return of(error).pipe(delay(RETRY_DELAY));
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
