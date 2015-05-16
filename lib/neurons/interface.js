/**
A generic interface for Neurons.
It includes getters and setters for a neuron's weight and biases.

Classes inheriting from this interface should implement a `_process`
function that takes an array of bits of size equal to the neuron's
list of weights.

@class
@param {array} weights - An array of weights to apply to input bits.
@param {number} bias - A number added to the product of input bits and their weights.
*/
function NeuronInterface (weights, bias) {
  this._weights = weights;
  this._bias = bias;
}

NeuronInterface.prototype = {
  /**
  Get or set the entire array of the neuron's weights.
  @function
  @param {array} weights - The new list of weights. If undefined, returns the current list of weights.
  */
  weights: function (weights) {
    if (weights === undefined)
      return this._weights;
    else
      this._weights = weights;
  },
  /**
  Get or set the neuron's weight value for a given input bit.
  @function
  @param {number} i - The index of the weight to get or set.
  @param {number} n - The new value for the specified weight. If undefined, returns the current weight value.
  */
  weight: function (i, n) {
    if (n === undefined)
      return this._weights[i];
    else
      this._weights[i] = n;
  },
  /**
  Get or set the Perceptron's bias value.
  @function
  @param {number} n - The new bias value. If undefined, returns the current bias value.
  */
  bias: function (n) {
    if (n === undefined)
      return this._bias;
    else
      this._bias = n;
  },
  /**
  Given an array of input bits, return the neuron's output.
  If the array of input bits is a different length than
  the neuron's list of weights, it will throw an error.
  If `_process` is unimplemented, it will also throw an error.

  @function
  @param {array} input - An array of input bits.
  */
  process: function (input) {
    if (input.length !== this.weights().length)
      throw new Error("input.length does not match weights.length: " + input.length + ' !== ' + this.weights().length);
    else if (!this._process)
      throw new Error("Not Implemented");
    else
      return this._process(input);
  }
};

module.exports = NeuronInterface;
