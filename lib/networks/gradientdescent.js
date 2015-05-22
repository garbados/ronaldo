var _ = require('underscore');
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
Adjusts weights and biases using a gradient descent cost function,
and backpropogating it through the network's layers.

@function
@param {number} learning_rate - A small, positive number.
@param {array} training_data - array of [input, output] pairs to train against.
*/
GradientDescentNetwork.prototype._train = function (learning_rate, training_data) {
  var self = this;
  _.range(training_data).forEach(function (i) {
    var input = training_data[i][0];
    var target = training_data[i][1];
    var output = self.process(input);
  });
};

module.exports = GradientDescentNetwork;
