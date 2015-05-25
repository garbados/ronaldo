var _ = require('underscore');
var mnist = require('mnist-data');
var assert = require('assert');
var lib = require('../lib');

var TRAINING_DATA = mnist.training(10);
var TESTING_DATA = mnist.testing(10);

function flatten_image (matrix) {
  return _.flatten(matrix);
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
      this.network = new lib.networks.Network([28 * 28, 15, 10]);
    });

    it('should train with the dataset', function () {
      this.timeout(0);
      var flat_images = TRAINING_DATA.images.values.map(flatten_image);
      var binary_labels = TRAINING_DATA.labels.values.map(label_to_bitmap);
      var data = _.zip(flat_images, binary_labels);
      // accurately convert integers to bit maps
      assert.equal(binary_labels[0][TRAINING_DATA.labels.values[0]], 1);
      // trains the network without throwing errors
      this.network.train(data);
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
