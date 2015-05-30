var brain = require('brain');
var _ = require('underscore');
var mnist = require('mnist-data');
var assert = require('assert');
var lib = require('../lib');

function flatten_image (matrix) {
  return _.flatten(matrix).map(function (i) {
    // return greyscale values between 0 and 1
    return i / 255;
  });
}

function label_to_bitmap (label) {
  return _.range(10).map(function (i) {
    return i === label ? 1 : 0;
  });
}

function bitmap_to_label (bitmap) {
  return bitmap.indexOf(Math.max.apply(Math, bitmap));
}

function bitmap_error (bitmap, label) {
  return bitmap.reduce(function (a, b, i) {
    return a + (i === label ? 1 - b : b);
  }, 0);
} 

describe('classifying mnist digits', function () {
  this.timeout(0);

  describe('networks with 1 hidden layer', function () {
    before(function () {
      this.network = new lib.networks.Network([28 * 28, 30, 10]);
      this.training_data = mnist.training(100);
      this.flat_images = this.training_data.images.values.map(flatten_image);
      this.label_bitmaps = this.training_data.labels.values.map(label_to_bitmap);
      // train network
      var data = _.zip(this.flat_images, this.label_bitmaps);
      this.network.train(data, {
        epochs: 10
      });
    });

    it('should train with the dataset to recognize inputs it has trained on', function () {
      var output = this.network.process(this.flat_images[0]);
      var output_label = bitmap_to_label(output);
      console.log(output, this.training_data.labels.values[0]);
      assert.equal(output_label, this.training_data.labels.values[0]);
    });
  });

  // used as a control group
  describe('harthur/brain', function () {
    before(function () {
      this.network = new brain.NeuralNetwork();
      this.training_data = mnist.training(10);
      this.flat_images = this.training_data.images.values.map(flatten_image);
      this.label_bitmaps = this.training_data.labels.values.map(label_to_bitmap);
      // train network
      var data = _.zip(this.flat_images, this.label_bitmaps).map(function (d) {
        return { input: d[0], output: d[1] };
      });
      this.network.train(data);
    });

    it('should train with the dataset to recognize inputs it has trained on', function () {
      var output = this.network.run(this.flat_images[0]);
      var output_label = bitmap_to_label(output);
      assert.equal(output_label, this.training_data.labels.values[0]);
    });
  });
});
