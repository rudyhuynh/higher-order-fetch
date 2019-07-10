import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/defer";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/delay";

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
    return Observable.defer(() => {
      return Observable.fromPromise(
        fetch(input, init).then(resp => {
          if ((resp.status + "").startsWith("5")) throw resp;
          return resp;
        })
      );
    })
      .retryWhen(errors => {
        return errors.mergeMap(error => {
          if (++count >= MAX_RETRY) {
            return Observable.throw(error);
          } else {
            return Observable.of(error).delay(RETRY_DELAY);
          }
        });
      })
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
