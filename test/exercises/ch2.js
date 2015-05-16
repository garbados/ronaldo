var assert = require('assert');
var neurons;
if (process.env.COVERAGE)
  neurons = require('../../lib-cov/neurons');
else
  neurons = require('../../lib/neurons');

describe('exercises - chapter 2', function () {
  before(function () {
    this.input = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ];
  });

  it('(1) map the output of a layer of 15 neurons to a layer of 4 neurons, each representing the digits 0-9.', function () {
    var self = this;

    var output_layer = [
      new neurons.Perceptron([0, 0, 0, 0, 0, 0, 0, 0, 1, 1], 0),
      new neurons.Perceptron([0, 0, 0, 0, 1, 1, 1, 1, 0, 0], 0),
      new neurons.Perceptron([0, 0, 1, 1, 0, 0, 1, 1, 0, 0], 0),
      new neurons.Perceptron([0, 1, 0, 1, 0, 1, 0, 1, 0, 1], 0)
    ];

    var answers = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
      [0, 0, 1, 1],
      [0, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 1],
      [1, 0, 0, 0],
      [1, 0, 0, 1],
    ];

    function process_input (neuron) { return neuron.process(self.input[i]); }

    var i, j, output;
    for (i = 0; i < 10; i++) {
      output = output_layer.map(process_input);
      for (j = 0; j < output.length; j++) {
        assert(output[j] === answers[i][j]);
      }
    }
  });
});
