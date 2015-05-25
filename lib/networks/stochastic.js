var _ = require('underscore');
var Network = require('./interface');
var util = require('util');

/**
Network that samples training data
into mini batches, in order to learn
more quickly with less processing
without sacrificing significant accuracy.

@class
@implements Network
*/
function StochasticNetwork () {
  return Network.apply(this, arguments);
}

util.inherits(StochasticNetwork, Network);

/*
Stochastic training function.
Breaks training data into small batches 
and learns from them one batch at a time.

@function
@param {array} training_data - [input, output] pairs used to guide learning.
@param {number} epochs - Number of rounds to train against the data.
@param {number} learning_rate - Small, positive number (ex: 0.3) indicating the rate of learning.
@param {number} batch_size - Size of batches of training data to train against at a time.
**/
StochasticNetwork.prototype.train = function (training_data, epochs, learning_rate, batch_size) {
  epochs = epochs || 300;
  learning_rate = learning_rate || 0.3;
  batch_size = batch_size || 10;

  var batch;
  for (var i = 0; i < epochs; i++) {
    batch = _.sample(training_data, batch_size);
    for (var j = 0; j < batch.length; j++) {
      var data = batch[j];
      this._backpropogate(data[0], data[1], learning_rate);
    }
  }
};

module.exports = StochasticNetwork;
