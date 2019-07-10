/**
 * Create a fetch which bypass cache
 */
var bypassCacheHOF = function bypassCacheHOF(fetch) {
  return function (input, init) {
    var bypassCacheUrl;

    if (input.includes("?")) {
      bypassCacheUrl = input + "&_v=" + Math.random();
    } else {
      bypassCacheUrl = input + "?_v=" + Math.random();
    }

    return fetch(bypassCacheUrl, init);
  };
};

export { bypassCacheHOF };
}

    return fetch(bypassCacheUrl, init);
  };
};

exports.bypassCacheHOF = bypassCacheHOF;
