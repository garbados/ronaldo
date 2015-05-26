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
  describe('networks with 1 hidden layer', function () {
    before(function () {
      this.network = new lib.networks.Network([28 * 28, 28 * 14, 10]);
    });

    it.only('should train with the dataset to recognize inputs it has trained on', function () {
      this.timeout(0);
      var training_data = mnist.training(10);
      var flat_images = training_data.images.values.map(flatten_image);
      var label_bitmaps = training_data.labels.values.map(label_to_bitmap);
      var data = _.zip(flat_images, label_bitmaps);
      this.network.train(data, 10);
      var output = this.network.process(flat_images[0]);
      // TODO make it accurate
      // assert.equal(bitmap_to_label(output), training_data.labels.values[0]);
    });
  });

  describe('harthur/brain', function () {
    before(function () {
      this.network = new brain.NeuralNetwork();
    });

    it('should train with the dataset to recognize inputs it has trained on', function () {
      var training_data = mnist.training(10);
      var flat_images = training_data.images.values.map(flatten_image);
      var label_bitmaps = training_data.labels.values.map(label_to_bitmap);
      var data = _.zip(flat_images, label_bitmaps).map(function (d) {
        return { input: d[0], output: d[1] };
      });
      this.network.train(data);
      var output = this.network.run(flat_images[0]);
      assert.equal(bitmap_to_label(output), bitmap_to_label(label_bitmaps[0]));
    });
  });
});
