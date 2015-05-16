var util = require('util');
var NeuronInterface = require('./interface');

/**
The SigmoidNeuron is a neuron that,
given an array of input bits,
takes the product of those bits
and their weights, plus the neuron's "bias",
and returns the negative inverse of that value.

Unlike a Perceptron, the SigmoidNeuron
returns values between 0 and 1.

@class
@implements NeuronInterface
*/
function SigmoidNeuron () {
  return NeuronInterface.apply(this, arguments);
}

util.inherits(SigmoidNeuron, NeuronInterface);

/**
Given an array of input bits,
takes the product of those bits
and their weights, plus the neuron's "bias",
and returns the negative inverse of that value.

@function
@param {array} input - An array of input bits.
*/
SigmoidNeuron.prototype._process = function (input) {
  var self = this;
  var result = input.map(function (x, i) {
    return (self.weight(i) * x);
  }).reduce(function (a, b) {
    return a + b;
  }, self.bias());

  var inverse = 1 / (1 + Math.exp(-result));

  return inverse;
};

module.exports = SigmoidNeuron;
