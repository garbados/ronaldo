var assert = require('assert');
var networks;
if (process.env.COVERAGE)
  networks = require('../../lib-cov/networks');
else
  networks = require('../../lib/networks');

describe('exercises - chapter 2', function () {
  describe('backpropogation', function () {
    before(function () {
      this.network = new networks.Network([2, 5, 3]);
      this.input = [0, 1];
      this.target = [1, 0, 1];
      this.training_data = [
        [this.input, this.target]
      ];
      this.untrained_output = this.network.process(this.input);
      this.network.train(this.training_data);
      this.trained_output = this.network.process(this.input);
    });

    it('(1) untrained and trained outputs should be different', function () {
      var self = this;
      this.untrained_output.forEach(function (bit, i) {
        assert.notEqual(bit, self.trained_output[i]);
      });
    });

    it('(2) outputs after training should remain deterministic', function () {
      var self = this;
      var trained_output2 = this.network.process(this.input);
      this.trained_output.forEach(function (bit, i) {
        assert.equal(bit, trained_output2[i]);
      });
    });

    it('(3) training should modify weights to more correctly predict a given output', function () {
      var self = this;
      var errors = [this.untrained_output, this.trained_output].map(function (output) {
        return output.map(function (bit, i) {
          return Math.abs(self.target[i] - bit);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      });
      console.log(this.target, this.untrained_output, this.trained_output);
      assert(errors[0] > errors[1]);
    });
  });
});
