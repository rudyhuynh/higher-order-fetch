function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    if (i % 2) {
      var source = arguments[i] != null ? arguments[i] : {};
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i]));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(arguments[i], key));
      });
    }
  }

  return target;
}

/**
 * This higher-order fetch creates a fetch which has some default headers
 * defined in DEFAULT_HEADERS
 */
var defaultHeadersHOF = function defaultHeadersHOF(defaultHeaders) {
  return function (fetch) {
    return function (input) {
      var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return fetch(input, _objectSpread2({}, init, {
        headers: mergeWithDefaultHeaders(init.headers, defaultHeaders)
      }));
    };
  };
};
function mergeWithDefaultHeaders() {
  var initHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultHeaders = arguments.length > 1 ? arguments[1] : undefined;
  var headerObj;

  if (initHeaders instanceof Headers) {
    headerObj = initHeaders.entries() //convert array of entries into object:
    .reduce(function (acc, val) {
      return _objectSpread2({}, acc, _defineProperty({}, val[0], val[1]));
    }, {});
  } else {
    headerObj = initHeaders;
  }

  return _objectSpread2({}, defaultHeaders, {}, headerObj);
}

export { defaultHeadersHOF, mergeWithDefaultHeaders };
ers, {}, headerObj);
}

exports.defaultHeadersHOF = defaultHeadersHOF;
exports.mergeWithDefaultHeaders = mergeWithDefaultHeaders;
