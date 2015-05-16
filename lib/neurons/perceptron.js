var assert = require('assert');

/**
The Perceptron is a type of neuron that
sums the product of input values and
their respective weights. If that sum,
plus the Perceptron's "bias", is
greater than 0, it outputs 1.
Else, it outputs 0.

@constructor
@param {array} weights - An array of weights to apply to input bits.
@param {number} bias - A number added to the product of input bits and their weights.
*/
function Perceptron (weights, bias) {
  this._weights = weights;
  this._bias = bias;
}

Perceptron.prototype = {
  /**
  Get or set the Perceptron's weight value for a given input bit.
  @function
  @param {number} i - The index of the weight to get or set.
  @param {number} n - The new value for the specified weight. If undefined, returns the current weight value.
  */
  weight: function (i, n) {
    if (n === undefined)
      return this._weights[i];
    else
      this._weights[i] = n;
  },
  /**
  Get or set the Perceptron's bias value.
  @function
  @param {number} n - The new bias value. If undefined, returns the current bias value.
  */
  bias: function (n) {
    if (n === undefined)
      return this._bias;
    else
      this._bias = n;
  },
  /**
  Given an array of input bits, return the Perceptron's output.
  If the array of input bits is a different length than
  the Perceptron's list of weights, it will throw an error.
  @function
  @param {array} input - An array of input bits.
  */
  process: function (input) {
    if (input.length !== this._weights.length)
      throw new Error("input.length does not match weights.length: " + input.length + ' !== ' + this._weights.length);

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
