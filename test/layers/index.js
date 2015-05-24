var assert = require('assert');

var layers;
if (process.env.COVERAGE)
  layers = require('../../lib-cov/layers');
else
  layers = require('../../lib/layers');

describe('network layers', function () {
  Object.keys(layers).forEach(function (name) {
    var layer = layers[name];

    describe(name, function () {
      before(function () {
        this.size = 3;
        this.input = [1, 0, 1, 0, 1];
        this.layer = new layers.Layer(this.size, this.input.length);
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
  });
});
