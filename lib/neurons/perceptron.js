var assert = require('assert');

function Perceptron (weights, bias) {
  this._weights = weights;
  this._bias = bias;
}

Perceptron.prototype = {
  weight: function (i, n) {
    if (n === undefined)
      return this._weights[i];
    else
      this._weights[i] = n;
  },
  bias: function (n) {
    if (n === undefined)
      return this._bias;
    else
      this._bias = n;
  },
  process: function (input) {
    assert(input.length === this._weights.length);

    var self = this;
    var result = input.map(function (x, i) {
      return (self.weight(i) * x);
    }).reduce(function (a, b) {
      return a + b;
    }, self.bias());

    if (result > 0)
      return 1;
    else
      return 0;
  }
};

module.exports = Perceptron;
