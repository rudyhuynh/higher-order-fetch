import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';

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
      return Observable.defer(function () {
        return Observable.fromPromise(fetch(input, init).then(function (resp) {
          if ((resp.status + "").startsWith("5")) throw resp;
          return resp;
        }));
      }).retryWhen(function (errors) {
        return errors.mergeMap(function (error) {
          if (++count >= MAX_RETRY) {
            return Observable.throw(error);
          } else {
            return Observable.of(error).delay(RETRY_DELAY);
          }
        });
      }).toPromise().then(function (resp) {
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
= 500) return resp;
        throw resp;
      });
    }

    return fetch(input, init);
  };
};

exports.MAX_RETRY = MAX_RETRY;
exports.onErrorRetryHOF = onErrorRetryHOF;
