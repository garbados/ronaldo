/**
A generic interface for cost functions.

@class
@interface
*/
function CostFunction () {}

CostFunction.prototype = {
  /**
  @function
  @param {number} output - the actual output value
  @param {number} target - the desired output value
  @returns {number} the cost associated with the output and target
  */
  fn: function (output, target) {
    throw new Error("Not Implemented");
  },
  /**
  @function
  @param {array} input - the array of input values
  @param {number} output - the actual output value
  @param {number} target - the desired output value
  @returns {number} the error delta associated with the output and target
  */
  delta: function (input, output, target) {
    throw new Error("Not Implemented");
  }
};

module.exports = CostFunction;
