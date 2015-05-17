var Network = require('./network');
var util = require('util');

/**
Network that uses the gradient descent cost function
to optimize weights and biases.

@class
@implements Network
*/
function GradientDescentNetwork () {
  return StochasticNetwork.apply(this, arguments);
}

util.inherits(GradientDescentNetwork, Network);

/**
TODO documentation

@function
@param {number} learning_rate - A small, positive number.
@param {array} training_data - array of [input, output] pairs to train against.
*/
GradientDescentNetwork.prototype._train = function (learning_rate, training_data) {}; // TODO

module.exports = GradientDescentNetwork;
