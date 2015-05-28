var _ = require('underscore');
var neurons = require('../neurons');
var costfunctions = require('../costfunctions');
var layers = require('../layers');

/**
Generic neural network. Subclasses must implement a `_train` method
to adjust weights and biases based on training data and a learning rate.

@class
@interface
@param {array} sizes - list of sizes for each layer, ex: [2, 3, 1] -> 2-neuron layer, 3-neuron layer, 1-neuron layer.
@param {object} layer - (optional) layer class to use. Defaults to the basic Layer.
@param {object} cost - (optional) cost function to use. Defaults to MeanSquaredError.
*/
function Network (sizes, layer, cost) {
  var self = this;
  this._layer = layer || layers.Layer;
  this._cost = cost ? new cost() : new costfunctions.MeanSquaredError();
  this._layers = sizes.map(function (size, i) {
    return new self._layer(size, sizes[i-1] || size);
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
@param {array} input - array of input bits.
@returns {array} array of output bits
*/
Network.prototype.process = function (input) {
  return this.layers().reduce(function (input, layer) {
    return layer.process(input);
  }, input);
};

/**
Calculates the network's output at each layer
for the given array of input values.

@function
@param {array} input - array of input bits
@returns {array} array of arrays of output bits for each layer
*/
Network.prototype._feedforward = function (input) {
  var outputs = [];
  var layers = this.layers();
  for (var i = 0; i < layers.length; i++) {
    output = layers[i].process(input);
    outputs.push(output);
    input = output;
  }
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
  var num_layers = this.layers().length;
  for (var i = 1; i < num_layers; i++) {
    // input size for the current layer === # of neurons in previous layer
    var layer = this.layer(i);
    var input_size = this.layer(i-1).neurons().length;
    var layer_size = layer.neurons().length;
    for (var j = 0; j < layer_size; j++) {
      var neuron = layer.neuron(j);
      var delta = deltas[i-1][j];
      var output = outputs[i][j];
      for (var k = 0; k < input_size; k++) {
        var change = learning_rate * delta * output;
        neuron.weight(k, neuron.weight(k) + change);
      }
      var bias = neuron.bias() + (learning_rate * delta);
      neuron.bias(bias);
    }
  }
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
Network.prototype._calculate_deltas = function (input, outputs, target) {
  var self = this;
  // 1. output errors for the output layer and
  // 2. backpropogate the errors through prior layers
  var errors = [];
  var deltas = [];
  var num_layers = this.layers().length - 1;
  for (var i = num_layers; i > 0; i--) {
    var layer = this.layer(i);    
    var layer_size = layer.neurons().length;
    // add a new layer to errors and deltas for every layer we deal with
    errors.unshift([]);
    deltas.unshift([]);
    // calculate errors for each neuron in each layer
    for (var j = 0; j < layer_size; j++) {
      var neuron = layer.neuron(j);
      var output = outputs[i][j];
      var error = 0;
      if (i === num_layers) {
        // output layer
        error -= self._cost.delta(input, output, target[j]);
      } else {
        // hidden layers
        for (var k = 0; k < deltas[1].length; k++) {
          // compute the delta for each weight of the next layer 
          // corresponding to each bit of this layer's output
          error -= self.layer(i+1).neuron(k).weight(j) * deltas[1][k];
        }
      }
      errors[0][j] = error;
      deltas[0][j] = error * output * (1 - output);
    }
  }
  return [errors, deltas];
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
@returns {array} deltas for each neuron of each layer in the network, besides the input layer
*/
Network.prototype._backpropogate = function (input, target, learning_rate) {
  // 1. feedforward
  var outputs = this._feedforward(input);
  // 2. calculate deltas
  var results = this._calculate_deltas(input, outputs, target);
  var errors = results[0];
  var deltas = results[1];
  // 3. adjust network
  this._adjust_network(learning_rate, outputs, deltas);

  return [outputs, errors];
};

/**
Given training data, a number of epochs, and a learning rate,
trains the network to more accurately predict
correct outputs for given inputs.

The second parameter accepts an object containing custom training settings, specifically:
* epochs: number of rounds to train against the data. Defaults to 20,000.
* learning_rate: value between 0 and 1 representing how quickly the network learns. Defaults to 0.3.
* threshold: error threshold. if the network attains an error rate under this threshold, it stops training early. Defaults to 0.005.

@function
@param {array} training_data - array of [input, correct_output] pairs used to train the network
@param {object} options - options object.
@returns {array} [i, error] where i is the number of iterations it took to reach the returned error rate
*/
Network.prototype.train = function (training_data, opts) {
  opts = opts || {};
  var self = this;
  var error_threshold = opts.threshold || Math.pow(10, -3) * 5;
  var epochs = opts.epochs || Math.pow(10, 4) * 2;
  var learning_rate = opts.learning_rate || 0.3;
  var error = 1;

  for (var i = 0; i < epochs && error > error_threshold; i++) {
    error = 0;
    for (var j = 0; j < training_data.length; j++) {
      var input = training_data[j][0];
      var target = training_data[j][1];
      var result = this._backpropogate(input, target, learning_rate);
      var outputs = result[0];
      var network_output = outputs[outputs.length - 1];
      // aggregate errors only from the output layer
      for (var k = 0; k < network_output.length; k++) {
        error += this._cost.fn(network_output[k], target[k]);
      }
    }
    error = error / training_data.length;
  }

  return [i, error];
};

module.exports = Network;
