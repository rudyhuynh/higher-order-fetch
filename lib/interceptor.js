function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var beforeRequestInterceptors = [];
var afterResponseInterceptors = [];
/**
 * To define something to do before every fetch request.
 * If any interceptor returns false, the process will be stop immediately.
 * @param {function} interceptor callback that will be called before every request
 * @returns {function} Callback to remove added interceptor
 */

function addBeforeRequestInterceptor(interceptor) {
  beforeRequestInterceptors.push(interceptor);
  return function () {
    var index = beforeRequestInterceptors.indexOf(interceptor);
    beforeRequestInterceptors.splice(index, 1);
  };
}
/**
 * To define something to do after every fetch response.
 * If any interceptor returns false, the process will be stop immediately.
 * @param {function} interceptor callback that will be called after every response
 */

function addAfterResonseInterceptor(interceptor) {
  afterResponseInterceptors.push(interceptor);
  return function () {
    var index = afterResponseInterceptors.indexOf(interceptor);
    afterResponseInterceptors.splice(index, 1);
  };
}
var interceptorHOF = function interceptorHOF(fetch) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(resource, init) {
        var beforeRequestInterceptorsResult, response, afterResponseInterceptorsResult;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //run interceptors before each request
                beforeRequestInterceptorsResult = applyBeforeRequestInterceptors(beforeRequestInterceptors);

                if (!(beforeRequestInterceptorsResult === false)) {
                  _context.next = 3;
                  break;
                }

                throw new Error("Fetch Promise was canceled by interceptor before requested");

              case 3:
                _context.next = 5;
                return fetch(resource, init);

              case 5:
                response = _context.sent;
                // run interceptors after each requests
                afterResponseInterceptorsResult = applyAfterResponseInterceptors(response, afterResponseInterceptors);

                if (!(afterResponseInterceptorsResult === false)) {
                  _context.next = 9;
                  break;
                }

                throw new Error("Fetch Promise was canceled by interceptor after responded");

              case 9:
                return _context.abrupt("return", response);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

function applyBeforeRequestInterceptors(interceptors) {
  interceptors.forEach(function (interceptor) {
    try {
      var interceptorResult = interceptor();

      if (interceptorResult === false) {
        console.error("Interceptor ", interceptor, " has cancel signal. This makes the request stop immediately.");
        return false;
      }
    } catch (e) {
      console.error("Error from interceptor ".concat(interceptor), e);
      return false;
    }
  });
}

function applyAfterResponseInterceptors(response, interceptors) {
  interceptors.forEach(function (interceptor) {
    try {
      var interceptorResult = interceptor(response);

      if (interceptorResult === false) {
        console.error("Interceptor ", interceptor, " has cancel signal. This makes the request stop immediately.");
        return false;
      }
    } catch (e) {
      console.error("Error from interceptor ".concat(interceptor), e);
      return false;
    }
  });
}

export { addAfterResonseInterceptor, addBeforeRequestInterceptor, interceptorHOF };
ts.addAfterResonseInterceptor = addAfterResonseInterceptor;
exports.addBeforeRequestInterceptor = addBeforeRequestInterceptor;
exports.interceptorHOF = interceptorHOF;
