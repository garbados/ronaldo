var CostFunction = require('./interface');
var util = require('util');

/**
The cross-entropy cost function for a single pair of values.
wiki: http://en.wikipedia.org/wiki/Cross_entropy

@class
@implements CostFunction
*/
function CrossEntropy () {
  return CostFunction.apply(this, arguments);
}

util.inherits(CrossEntropy, CostFunction);

CrossEntropy.prototype.fn = function (output, target) {
  var result = -target * Math.log(output) - (1 - target) * Math.log(1 - output);
  return isNaN(result) ? 0 : result;
};

CrossEntropy.prototype.delta = function (inputs, output, target) {
  return (output - target);
};

module.exports = CrossEntropy;
