var assert = require('assert');

var SoftmaxLayer;
if (process.env.COVERAGE)
  SoftmaxLayer = require('../../lib-cov/layers/softmax');
else
  SoftmaxLayer = require('../../lib/layers/softmax');

describe('softmax layer', function () {
  before(function () {
    this.layer = new SoftmaxLayer(5, 3);
    this.input = [1, 0, 1];
  });

  it('should return outputs which sum to 1', function () {
    var outputs = this.layer.process(this.input);
    var sum = outputs.reduce(function (a, b) {
      return a + b;
    });
    // handle floating point precision problems
    assert(sum - 1 < Math.pow(1, -10));
  });
});
