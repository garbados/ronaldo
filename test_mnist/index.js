var _ = require('underscore');
var mnist = require('mnist-data');
var assert = require('assert');
var lib = require('../lib');

var TRAINING_DATA = mnist.training(10);
var TESTING_DATA = mnist.testing(100);

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
      this.network = new lib.networks.Network([28 * 28, 30, 10]);
    });

    it.only('should train with the dataset to recognize inputs it has trained on', function () {
      this.timeout(0);
      var flat_images = TRAINING_DATA.images.values.map(flatten_image);
      var binary_labels = TRAINING_DATA.labels.values.map(label_to_bitmap);
      this.network.train(_.zip(flat_images, binary_labels), 30);
      console.log(flat_images[0]);
      var output = this.network.process(flat_images[0]);
      console.log(output, binary_labels[0]);
    });

    it('should predict labels for the testing data', function () {
      this.timeout(0);
      var self = this;
      var flat_images = TESTING_DATA.images.values.map(flatten_image);
      var results = flat_images.map(function (image) {
        return self.network.process(image);
      });
      var errors = _.zip(results, TESTING_DATA.labels.values).map(function (data) {
        return bitmap_error(data[0], data[1]);
      });
    });
  });
});
