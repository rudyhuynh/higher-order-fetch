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

/**
 * Make a fetch that return an array of `[jsonData, statusCode]`
 * Example:
 * ```js
 * const fetch = jsonDataStatusResponseHOF()(window.fetch)
 * const [data, status] = await fetch('http://example.com/data')
 * // `data` is a JSON object only if fetch data success with JSON data, otherwise, it is either a Response or an Error.
 * // `status` is either HTTP Status Code or -1 if fetch fail.
 * ```
 * @param {boolean} suppressWarning default is false, if true, no error will be logged when request or parse JSON fail.
 * @returns {function} a fetch-like function
 */
var jsonDataStatusResponseHOF = function jsonDataStatusResponseHOF() {
  var suppressWarning = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (fetch) {
    return (
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(resource, init) {
          var response, json;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return fetch(resource, init);

                case 3:
                  response = _context.sent;
                  _context.next = 6;
                  return response.json();

                case 6:
                  json = _context.sent;
                  return _context.abrupt("return", [json, response.status]);

                case 10:
                  _context.prev = 10;
                  _context.t0 = _context["catch"](0);
                  !suppressWarning && console.warn(_context.t0);
                  return _context.abrupt("return", response ? [response, response.status] : [_context.t0, -1]);

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 10]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }()
    );
  };
};

export { jsonDataStatusResponseHOF };
s);
        };
      }()
    );
  };
};

exports.jsonDataStatusResponseHOF = jsonDataStatusResponseHOF;
