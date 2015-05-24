var math = require('mathjs');
var CostFunction = require('./interface');
var util = require('util');

/**
The mean squared error cost function for a single pair of values.
wiki: http://en.wikipedia.org/wiki/Mean_squared_error

@class
@implements CostFunction
*/
function MeanSquaredError () {
  return CostFunction.apply(this, arguments);
}

util.inherits(MeanSquaredError, CostFunction);

MeanSquaredError.prototype.fn = function (output, target) {
  return 0.5 * Math.pow(math.norm(output - target), 2);
};

MeanSquaredError.prototype.delta = function (inputs, output, target) {
  var error = output - target;
  return inputs.map(function (input) {
    var z = 1 / (1 + Math.exp(-input)); // sigmoid prime value
    return z * (1 - z) * error;
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
};

module.exports = MeanSquaredError;
