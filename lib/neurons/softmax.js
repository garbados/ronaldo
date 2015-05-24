var Neuron = require('./interface');
var util = require('util');
var _ = require('underscore');


/**
TODO

@class
@implements Neuron
*/
function SoftmaxNeuron () {
  return Neuron.apply(this, arguments);
}

util.inherits(SoftmaxNeuron, Neuron);

/**
TODO

@function
@param {array} input - an array of input bits
@returns {number} - the neuron's reduction of the input array to a value between 0 and 1 inclusive
*/
SoftmaxNeuron.prototype._process = function (input) {
  var self = this;
  var result = input.map(function (x, i) {
    return (self.weight(i) * x);
  }).reduce(function (a, b) {
    return a + b;
  }, self.bias());

  return Math.exp(result);
};

module.exports = SoftmaxNeuron;
