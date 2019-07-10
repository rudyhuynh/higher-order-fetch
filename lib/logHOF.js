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

var logHOF = function logHOF() {
  var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console.log;
  return function (fetch) {
    return (
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(resource, init) {
          var method, response;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (resource instanceof Request) {
                    logger(resource.method + " " + resource.url);
                  } else {
                    method = init ? init.method || "GET" : "GET";
                    logger(method + " " + resource);
                  }

                  _context.next = 3;
                  return fetch(resource, init);

                case 3:
                  response = _context.sent;
                  logger("\t Status " + response.status);
                  return _context.abrupt("return", response);

                case 6:
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
};

export { logHOF };
pply(this, arguments);
        };
      }()
    );
  };
};

exports.logHOF = logHOF;
