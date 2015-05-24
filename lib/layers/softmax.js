var util = require('util');
var SoftmaxNeuron = require('../neurons').SoftmaxNeuron;
var Layer = require('./basic');
var _ = require('underscore');

/**
TODO doc SoftmaxLayer

@class
@implements Layer
*/
function SoftmaxLayer (size, input_size) {
  return Layer.call(this, size, input_size, SoftmaxNeuron);
}

util.inherits(SoftmaxLayer, Layer);


/**
TODO doc SoftmaxLayer.process

@function
@param {array} inputs - an array of input bits
@returns {array} array of processed output bits
*/
SoftmaxLayer.prototype.process = function (inputs) {
  var results = this.neurons().map(function (neuron, j) {
    return neuron.process(inputs, j);
  });
  var sum = results.reduce(function (a, b) { return a + b; });
  return results.map(function (result) { return result / sum; });
};

module.exports = SoftmaxLayer;
