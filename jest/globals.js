global.fetch = jest.fn();
global.Headers = function Headers(init) {
  this.init = init || {};
};

Headers.prototype.entries = function() {
  return Object.entries(this.init);
};
