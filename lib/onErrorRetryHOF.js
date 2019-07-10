import { defer, from, throwError, of } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

var MAX_RETRY = 3;
var RETRY_DELAY = 500;
/**
 * NOTE: This requires `rxjs` as peer dependency.
 * Creat a fetch which retries when:
 * + GET with 500 error
 * + Network error
 * @param {*} fetch
 */

var onErrorRetryHOF = function onErrorRetryHOF(fetch) {
  return function (input) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!init.method || init.method.toUpperCase() === "GET") {
      var count = 0;
      return defer(function () {
        return from(fetch(input, init).then(function (resp) {
          if ((resp.status + "").startsWith("5")) throw resp;
          return resp;
        }));
      }).pipe(retryWhen(function (errors) {
        return errors.pipe(mergeMap(function (error) {
          if (++count >= MAX_RETRY) {
            return throwError(error);
          } else {
            return of(error).pipe(delay(RETRY_DELAY));
          }
        }));
      })).toPromise().then(function (resp) {
        return resp;
      }, function (resp) {
        if (resp.status === 500) return resp;
        throw resp;
      });
    }

    return fetch(input, init);
  };
};

export { MAX_RETRY, onErrorRetryHOF };

    }

    return fetch(input, init);
  };
};

exports.MAX_RETRY = MAX_RETRY;
exports.onErrorRetryHOF = onErrorRetryHOF;
