var _ = require('underscore');
var assert = require('assert');
var costfunctions;
if (process.env.COVERAGE)
  costfunctions = require('../../lib-cov/costfunctions');
else
  costfunctions = require('../../lib/costfunctions');

describe('cost functions', function () {
  Object.keys(costfunctions).forEach(function (name) {
    describe(name, function () {
      before(function () {
        this.input = [1, 0, 1];
        this.target = 0;
        this.output = 1;
        this.Cost = new costfunctions[name]();
      });

      it('should calculate a cost given desired and actual outputs', function () {
        var cost = this.Cost.fn(this.output, this.target);
        assert.equal(typeof cost, 'number');
        assert(cost >= 0);
      });

      it('should calculate a delta given an input array, and desired and actual outputs', function () {
        var delta = this.Cost.delta(this.input, this.output, this.target);
        assert.equal(typeof delta, 'number');
      });

      it('should approach the target value by applying the delta', function () {
        var self = this;
        var delta = this.Cost.delta(this.input, this.output, this.target);
        var errors = [this.output, this.output - delta].map(function (output) {
          return output - self.target;
        });
        // assert that the error diminishes after applying the delta
        assert(errors[0] > errors[1]);
      });
    });
  });
});
