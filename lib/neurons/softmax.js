var Neuron = require('./interface');
var util = require('util');
var _ = require('underscore');

function SoftmaxNeuron () {
  return Neuron.apply(this, arguments);
}

util.inherits(SoftmaxNeuron, Neuron);

SoftmaxNeuron.prototype._process = function (inputs, j) {
  var self = this;
  var result = inputs.map(function (x, i) {
    return (self.weight(i) * x);
  }).reduce(function (a, b) {
    return a + b;
  }, self.bias());

  return Math.exp(result);
};

module.exports = SoftmaxNeuron;
