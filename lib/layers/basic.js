var neurons = require('../neurons');
var _ = require('underscore');

/**
A single layer of neurons. Networks process input through multiple layers.

@class
@param {number} size - Number of neurons in the layer.
@param {number} input_size - Length of input arrays.
@param {object} Neuron - (optional) Class used to initialize neurons. Defaults to SigmoidNeuron.
*/
function Layer (size, input_size, Neuron) {
  Neuron = Neuron || neurons.SigmoidNeuron;
  this._neurons = _.range(size).map(function (i) {
    var weights, bias;
    if (i === 0) {
      weights = _.range(input_size).map(function () { return 0; });
      bias = 0;
    } else {
      weights = _.range(input_size).map(function () { return _.random(-1, 1); });
      bias = _.random(-1, 1);
    }
    return new Neuron(weights, bias);
  });
}

/**
Getter / setter for the layer's neurons.

@function
@param {array} neurons - (optional) A list of neurons to replace the layer's current neurons. If undefined, returns the list of current neurons.
*/
Layer.prototype.neurons = function (neurons) {
  if (neurons === undefined)
    return this._neurons;
  else
    this._neurons = neurons;
};

/**
Getter / setter for the layer's neurons, individually.

@function
@param {number} i - Index of the neuron to get or set.
@param {object} neuron - (optional) A single neuron, which replaces the i'th neuron. If undefined, returns the i'th neuron.
*/
Layer.prototype.neuron = function (i, neuron) {
  if (neuron === undefined)
    return this._neurons[i];
  else
    this._neurons[i] = neuron; 
};

/**
Given an array of input bits, returns the layer's output
when the input is applied to each neuron.

@function
@param {array} input - array of input bits
*/
Layer.prototype.process = function (input) {
  var self = this;
  return self.neurons().map(function (neuron) {
    return neuron.process(input);
  });
};

module.exports = Layer;
