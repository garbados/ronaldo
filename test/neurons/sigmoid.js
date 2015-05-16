var assert = require('assert');

var SigmoidNeuron;
if (process.env.COVERAGE)
  SigmoidNeuron = require('../../lib-cov/neurons/sigmoid');
else
  SigmoidNeuron = require('../../lib/neurons/sigmoid');



describe('sigmoid neuron', function () {
  before(function () {
    this.sigmoid = new SigmoidNeuron([0, 2, 5], -2);
    this.input = [1, 0, 1];
    this.bad_input = [0, 0, 0, 1];
  });

  it('it should reduce n inputs to 1 output', function () {
    var result = this.sigmoid.process(this.input);
    assert(result < 1);
    assert(result > 0);
  });

  it('should throw an error if given too many inputs', function () {
    var threw_error = false;
    try {
      this.sigmoid.process(this.bad_input);
    } catch (e) {
      threw_error = true;
    }
    assert(threw_error);
  });
});
