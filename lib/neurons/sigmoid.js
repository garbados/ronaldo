var assert = require('assert');

/**
The SigmoidNeuron is a neuron that,
given an array of input bits,
takes the product of those bits
and their weights, plus the neuron's "bias",
and returns the negative inverse of that value.

Unlike a Perceptron, the SigmoidNeuron
returns values between 0 and 1.

@constructor
@param {array} weights - An array of weights to apply to input bits.
@param {number} bias - A number added to the product of input bits and their weights.
*/
function SigmoidNeuron (weights, bias) {
  this._weights = weights;
  this._bias = bias;
}

SigmoidNeuron.prototype = {
  /**
  Get or set the SigmoidNeuron's weight value for a given input bit.
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
  Get or set the SigmoidNeuron's bias value.
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
  Given an array of input bits, return the SigmoidNeuron's output.
  If the array of input bits is a different length than
  the SigmoidNeuron's list of weights, it will throw an error.
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

    var inverse = 1 / (1 + Math.exp(-result));

    return inverse;
  }
};

module.exports = SigmoidNeuron;
