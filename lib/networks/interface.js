var _ = require('underscore');
var neurons = require('../neurons');
var Layer = require('./layer');

/**
Generic neural network. Subclasses must implement a `_train` method
to adjust weights and biases based on training data and a learning rate.

@class
@interface
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

/**
Given an example input and target output,
the network calculates modifications for its weights and biases
that will ensure it yields the proper output for the given input.

@function
@param {array} input - array of input bits
@param {array} target - array of bits representing desired output
@returns {array} [weights_delta, biases_delta] - an array of two arrays, of proposed modifications to 1. weights and 2. biases
*/
Network.prototype.backpropogate = function (input, target) {
  function compute_error (output, target) {
    return output * (1 - output) * (target - output);
  }

  // 1. feedforward: calculate inputs and outputs to each neuron of each layer
  var outputs = [];
  this.layers().reduce(function (input, layer, i) {
    var output = layer.process(input);
    outputs.push(output);
    return output;
  }, input);
  // 2. output errors for each neuron of the output layer
  var error = this.layers().slice(-1).map(function (layer, i) {
    return layer.neurons().map(function (neuron, j) {
      return compute_error(outputs[i][j], target[j]);
    });
  });
  var errors = [error];
  // 3. backpropogate the error, computing errors for each prior layer
  var feedforward = [input].concat(outputs);
  this.layers().reverse().slice(1).forEach(function (layer, l) {
    var i = outputs.length-1-l; // s.t. i represents the layer before this one
    var output = outputs[i];
    var deltas = errors[0];
    var error = layer.neurons().reduce(function (error, neuron, j) {
        return error + (deltas[j] * neuron.weight(j));
    }, 0);
    errors.unshift(error);
  });
  // 4. send the (current, delta) pairs to the learning function, which mutates weights and biases

}

/**
Calculates the delta for every neuron in the network for a given input and target pair.

@function
@param {array} - input
@param {array} - target
@returns {array} [i][j] matrix identifying deltas for every ith neuron for every jth layer
*/
Network.prototype.calculate_deltas = function (input, target) {}; // TODO

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
Network.prototype._train = function (learning_rate, batch) {
  throw new Error("Not Implemented");
};

/**
Pre-processes training data before handing it to the network's training
function, such that this method is the public way of training. `learn`
is for internal use only.

@function
@param {array} training_data - [input, output] pairs used to guide learning.
@param {number} epochs - Number of rounds to train against the data.
@param {number} learning_rate - Small, positive number (ex: 0.3) indicating the rate of learning.
*/
Network.prototype.train = function (training_data, epochs, learning_rate) {
  var self = this;
  _.range(epochs).forEach(function (i) {
    self._train(learning_rate, training_data);
  });
};

module.exports = Network;
