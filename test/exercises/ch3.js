var assert = require('assert');

var layers;
if (process.env.COVERAGE)
  layers = require('../../lib-cov/layers');
else
  layers = require('../../lib/layers');

describe('chapter 3 - exercises', function () {
  it('(1) show sigmoid layer outputs do not always sum to 1, while softmax layers do', function () {
    var size = 5;
    var input = [1, 0, 1];
    var sigmoid_layer = new layers.Layer(size, input.length);
    var softmax_layer = new layers.SoftmaxLayer(size, input.length);

    var sigmoid_output = sigmoid_layer.process(input);
    var softmax_output = softmax_layer.process(input);
    var sums = [sigmoid_output, softmax_output].map(function (outputs) {
      return outputs.reduce(function (a, b) {
        return a + b;
      });
    });

    assert.notEqual(sums[0], 1);
    // handle floating point precision problems
    assert(sums[1] - 1 < Math.pow(1, -10));
  });
});
