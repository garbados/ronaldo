var assert = require('assert');

var Layer;
if (process.env.COVERAGE)
  Layer = require('../../lib-cov/networks/layer');
else
  Layer = require('../../lib/networks/layer');

describe('network layer', function () {
  before(function () {
    this.size = 3;
    this.input = [1, 0, 1, 0, 1];
    this.layer = new Layer(this.size, this.input.length);
  });

  it('should have as many neurons as its initial size', function () {
    assert(this.layer.neurons().length === this.size);
  });

  it('should process an input array', function () {
    var result = this.layer.process(this.input);

    result.forEach(function (bit) {
      assert(bit <= 1);
      assert(bit >= 0);
    });
  });
});
