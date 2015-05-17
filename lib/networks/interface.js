var _ = require('underscore');
var neurons = require('../neurons');
var Layer = require('./layer');


/**
Generic neural network. Subclasses must implement `train`
to pre-process training data, and `learn` to learn from it.

@class
@param {array} sizes - list of sizes for each layer, ex: [2, 3, 1] -> 2-neuron layer, 3-neuron layer, 1-neuron layer.
@param {object} opts - Options object. opts.neuron specifies the class used to initialize the network's neurons.
*/
function Network (sizes, opts) {
  opts = opts || {};
  this._layers = sizes.map(function (size, i) {
    return new Layer(size, sizes[i-1] || size, opts.neuron);
  });
}

/**
Getter / setter for the network's neural layers.

@function
@param {array} layers - (optional) A list of layers to replace the network's current layers. If undefined, returns the list of current layers.
*/
Network.prototype.layers = function (layers) {
  if (layers === undefined)
    return this._layers;
  else
    this._layers = layers;
};

/**
Getter / setter for the network's neural layers, individually.

@function
@param {number} i - Index of the layer to get or set.
@param {object} layer - (optional) A single layer, which replaces the i'th layer. If undefined, returns the i'th layer.
*/
Network.prototype.layer = function (i, layer) {
  if (layer === undefined)
    return this._layers[i];
  else
    this._layers[i] = layer;
};

/**
Applies an array of input bits to each layer,
feeding its output into the next layer,
and returning the final layer's output.

@function
@param {array} input - Array of input bits.
*/
Network.prototype.process = function (input) {
  return this.layers().reduce(function (a, b) {
    return b.process(a);
  }, input);
};

/*
The network's learning function.
Calculates deltas and error rates,
and uses them to update weights and biases
to improve accuracy.

@function
@abstract
@param {number} learning_rate - A small, positive number.
@param {array} batch - array of [input, output] pairs to train against.
**/
Network.prototype.learn = function (learning_rate, batch) {
  throw new Error("Not Implemented");
};

/**
Pre-processes training data before handing it to the network's training
function, such that this method is the public way of training. `learn`
is for internal use only.

@function
@abstract
@param {array} training_data - [input, output] pairs used to guide learning.
@param {number} epochs - Number of rounds to train against the data.
@param {number} learning_rate - Small, positive number (ex: 0.3) indicating the rate of learning.
*/
Network.prototype.train = function (training_data, epochs, learning_rate) {
  throw new Error("Not Implemented");
};

module.exports = Network;