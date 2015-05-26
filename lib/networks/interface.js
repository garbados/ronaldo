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
  this._cost = cost ? new cost() : new costfunctions.CrossEntropy();
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
  this.layers().slice(1).forEach(function (layer, i) {
    // input size for the current layer === # of neurons in previous layer
    var input_size = self.layer(i).neurons().length;
    layer.neurons().forEach(function (neuron, j) {
      var delta = deltas[i][j];
      var output = outputs[i+1][j];
      for (var k = 0; k < input_size; k++) {
        var change = neuron.weight(k) - (learning_rate * delta * output);        
        neuron.weight(k, change);
      }
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
      if (l === 0) {
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
@param {number} epochs - (optional) number of rounds to train against the data. Defaults to 300.
@param {number} learning_rate - (optional) value between 0 and 1 representing how quickly the network learns. Defaults to 0.3.
*/
Network.prototype.train = function (training_data, epochs, learning_rate) {
  var self = this;
  
  epochs = epochs || 300;
  learning_rate = learning_rate || 0.3;

  for (var i = 0; i < epochs; i++) {
    for (var j = 0; j < training_data.length; j++) {
      var data = training_data[j];
      this._backpropogate(data[0], data[1], learning_rate);
    }
  }
};

module.exports = Network;
