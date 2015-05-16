var assert = require('assert');
var neurons;
if (process.env.COVERAGE)
  neurons = require('../../lib-cov/neurons');
else
  neurons = require('../../lib/neurons');

describe('exercises - chapter 1', function () {
  before(function () {
    this.input = [0, 0, 1];
    this.bad_input = [1, 0, 1, 1];
    this.weights = [2, -1, 3];
    this.bias = -2;
    this.perceptron = new neurons.Perceptron(this.weights, this.bias);
    this.sigmoid = new neurons.SigmoidNeuron(this.weights, this.bias);
  });

  it("(1) modifying a perceptron's weights and biases by a positive multiplier should not affect its output.", function () {
    var modifier = 2;
    var modified_weights = this.weights.map(function (x) { return x * modifier; });
    var modified_bias = this.bias * modifier;
    var modified_perceptron = new neurons.Perceptron(modified_weights, modified_bias);
    assert.equal(this.perceptron.process(this.input), modified_perceptron.process(this.input));
  });

  it('(2) sigmoid neuron networks and perceptron networks perform similarly under certain circumstances.', function () {
    var result = this.perceptron.process(this.input);
    var sigmoid_results = [];

    function multiply_weights (multiple, weights) {
      return weights.map(function (weight) {
        return weight * multiple;
      });
    }

    for (var i = 10; i < 1000; i += 10) {
      var neuron = new neurons.SigmoidNeuron(multiply_weights(i, this.weights), this.bias * i);
      sigmoid_results.push(neuron.process(this.input));
    }

    // as the coefficient grows, results should approach 1
    sigmoid_results.reduce(function (a, b) {
      assert(a <= b);
      return b;
    }, 0);

    // but at most they will be 1, like the perceptron
    assert(result >= sigmoid_results[sigmoid_results.length-1]);
  });
});