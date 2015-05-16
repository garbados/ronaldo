var assert = require('assert');
var Perceptron = require('../../lib/neurons/perceptron');

describe('perceptron', function () {
  before(function () {
    this.perceptron = new Perceptron([0, 2, 5], -2);
    this.input = [1, 0, 1];
    this.bad_input = [0, 0, 0, 1];
  });

  it('it should reduce n inputs to 1 output', function () {
    var result = this.perceptron.process(this.input);
    assert(result === 1);
  });

  it('should throw an error if given too many inputs', function () {
    var threw_error = false;
    try {
      this.perceptron.process(this.bad_input);
    } catch (e) {
      threw_error = true;
    }
    assert(threw_error);
  });
});
