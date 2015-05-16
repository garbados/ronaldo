var util = require('util');
var NeuronInterface = require('./interface');

/**
The Perceptron is a type of neuron that
sums the product of input values and
their respective weights. If that sum,
plus the Perceptron's "bias", is
greater than 0, it outputs 1.
Else, it outputs 0.

@class
@implements NeuronInterface
*/
function Perceptron () {
  return NeuronInterface.apply(this, arguments);
}

util.inherits(Perceptron, NeuronInterface);

/**
Given an array of input bits,
return 0 if
the product of input bits and weights
plus the neuron's bias
if greater than 0.
otherwise, returns 1.

@function
@param {array} input - An array of input bits.
*/
Perceptron.prototype._process = function (input) {
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
};

module.exports = Perceptron;
