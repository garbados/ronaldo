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
Breaks training data into batches 
and learns from them one batch at a time.

@function
@param {array} training_data - [input, output] pairs used to guide learning.
@param {number} epochs - Number of rounds to train against the data.
@param {number} learning_rate - Small, positive number (ex: 0.3) indicating the rate of learning.
@param {number} batch_size - Size of batches of training data to train against at a time.
**/
StochasticNetwork.prototype.train = function (training_data, epochs, learning_rate, batch_size) {
  var self = this;
  _.range(epochs).forEach(function (i) {
    var shuffled_data = _.shuffle(training_data);
    var mini_batches = _.groupBy(shuffled_data, function (data) {
      return data.length % batch_size;
    });

    Object.keys(mini_batches).forEach(function (j) {
      var batch = mini_batches[i];
      self._train(learning_rate, batch);
    });
  });
};

module.exports = StochasticNetwork;
