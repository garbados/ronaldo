var assert = require('assert');

var Network;
if (process.env.COVERAGE)
  Network = require('../../lib-cov/networks/interface');
else
  Network = require('../../lib/networks/interface');

describe('n-layer network', function () {
  before(function () {
    this.layers = [2, 5, 3];
    this.input = [1, 0];
    this.target = [1, 0, 1];
    this.network = new Network(this.layers);
  });

  it('should process input of length n into output of length m', function () {
    var output = this.network.process(this.input);
    assert(output.length === this.layers[this.layers.length-1]);
  });

  it('should calculate feedforward outputs from a given input', function () {
    var outputs = this.network._feedforward(this.input);
    var output = this.network.process(this.input);
    assert(outputs.length === this.network.layers().length);
    outputs[outputs.length-1].forEach(function (bit, i) {
      assert(bit === output[i]);
    });
  });

  it('should calculate deltas from an array of layer outputs and a desired output', function () {
    var outputs = this.network._feedforward(this.input);
    var deltas = this.network._calculate_deltas(outputs, this.target);
    console.log(deltas);
  });
});
