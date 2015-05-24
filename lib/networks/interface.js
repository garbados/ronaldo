var _ = require('underscore');
var neurons = require('../neurons');
var MeanSquaredError = require('../costfunctions').MeanSquaredError;
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
  this._cost = opts.cost ? new opts.cost() : new MeanSquaredError();
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
Calculates the network's output at each layer
for the given array of input values.

@function
@param {array} input - array of input bits
*/
Network.prototype._feedforward = function (input) {
  var outputs = [];
  this.layers().reduce(function (input, layer, i) {
    var output = layer.process(input);
    outputs.push(output);
    return output;
  }, input);
  return outputs;
};

/*
Given a learning rate, a matrix of inputs, and a matrix of deltas,
adjusts weights and biases for every neuron in every layer of the network.

@function
@param {number} learning_rate - A small, positive number.
@param {array} outputs - [i][j] matrix of outputs for every jth neuron of every ith layers
@param {array} deltas - [i][j] matrix of deltas for every jth neuron of every ith layer
**/
Network.prototype._adjust_network = function (learning_rate, outputs, deltas) {
  var self = this;
  this.layers().slice(1).forEach(function (layer, i) {
    var input_size = self.layer(i).neurons().length;
    layer.neurons().forEach(function (neuron, j) {
      var delta = deltas[i][j];
      var output = outputs[i+1][j];
      _.range(input_size).forEach(function (k) {
        var change = neuron.weight(k) - (learning_rate * delta * output);
        neuron.weight(k, change);
      });
      neuron.bias(learning_rate * delta);
    });
  });
};

/**
Given outputs for each layer and the desired network output,
the network calculates modifications for its weights and biases
that will ensure it yields the proper output for the given input.

@function
@param {array} outputs - [i][j] matrix of output bits for every jth neuron of every ith layer
@param {array} target - array of bits representing desired network output
@returns {array} [i][j] matrix of deltas for every jth neuron of every ith layer
*/
Network.prototype._calculate_deltas = function (outputs, target) {
  var self = this;
  // 1. output errors for the output layer and
  // 2. backpropogate the errors through prior layers
  var errors = [];
  this.layers().slice(1).reverse().forEach(function (layer, l) {
    var i = outputs.length-1-l; // index for the current layer
    
    // add a new layer to errors for every layer we deal with
    errors.unshift([]);
    
    // calculate errors for 
    layer.neurons().forEach(function (neuron, j) {
      if (i === outputs.length-1) {
        // output layer
        var input = outputs[0]; // the result of the input layer, which is just a pass-through
        errors[0][j] = self._cost.delta(input, outputs[i][j], target[j]);
      } else {
        // hidden and input layers
        var deltas = errors[1]; // errors from the next layer
        errors[0][j] = deltas.map(function (delta, k) {
          // compute the delta for each weight of the previous layer 
          // corresponding to each bit of this layer's output
          return self.layer(i+1).neuron(k).weight(j) * delta;
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      }
    });
  });

  return errors;
};

/**
The dreaded backpropogation algorithm.
First, calculates output from each layer of the network.
Then, calculates error rates for each neuron of each layer.
Lastly, uses those outputs, deltas, and a specified learning rate to adjust the weights and biases of the network.

@function
@param {array} input - array of input bits to the network
@param {array} target - array of desired output bits from the network for the given input
@param {number} learning_rate - (optional) value between 0 and 1 representing how quickly the network learns. Defaults to 0.3.
*/
Network.prototype._backpropogate = function (input, target, learning_rate) {
  // default to a sensible value
  learning_rate = learning_rate || 0.3;
  // 1. feedforward
  var outputs = this._feedforward(input);
  // 2. calculate deltas
  var deltas = this._calculate_deltas(outputs, target);
  // 3. adjust network
  this._adjust_network(learning_rate, outputs, deltas);
};

/**
Given training data, a number of epochs, and a learning rate,
trains the network to more accurately predict
correct outputs for given inputs.

@function
@param {array} training_data - array of [input, correct_output] pairs used to train the network
@param {number} epochs - (optional) number of rounds to train against the data. Defaults to 10^4.
@param {number} learning_rate - (optional) value between 0 and 1 representing how quickly the network learns. Defaults to 0.3.
*/
Network.prototype.train = function (training_data, epochs, learning_rate) {
  var self = this;
  
  epochs = epochs || Math.pow(10, 4);
  learning_rate = learning_rate || 0.3;

  _.range(epochs).forEach(function (i) {
    training_data.forEach(function (data) {
      self._backpropogate(data[0], data[1], learning_rate);
    });
  });
};

module.exports = Network;
