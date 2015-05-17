var assert = require('assert');

var Network;
if (process.env.COVERAGE)
  Network = require('../../lib-cov/networks/interface');
else
  Network = require('../../lib/networks/interface');

describe('n-layer network', function () {
  before(function () {
    this.layers = [2, 5, 3];
    this.network = new Network(this.layers);
  });

  it('should process input of length n into output of length m', function () {
    var input = [1, 0];
    var output = this.network.process(input);
    assert(output.length === this.layers[this.layers.length-1]);
  });
});
