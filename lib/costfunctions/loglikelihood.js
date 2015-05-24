var CostFunction = require('./interface');
var util = require('util');

/**
TODO

@class
@implements CostFunction
*/
function LogLikelihood () {}

util.inherits(LogLikelihood, CostFunction);

/**
TODO

@function
*/
LogLikelihood.prototype.fn = function (output, target) {
  return -1 * Math.log(1 - Math.abs(output - target));
};


/**
TODO

@function
*/
LogLikelihood.prototype.delta = function (input, output, target) {
  return output - target;
};

module.exports = LogLikelihood;
