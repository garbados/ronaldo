var Network = require('./interface');
var SoftmaxLayer = require('../layers/softmax');
var LogLikelihood = require('../costfunctions/loglikelihood');
var util = require('util');

/**
Network that uses layers of SoftmaxNeurons and the LogLikelihood cost function.

@class
@implements Network
@param {array} sizes - array of sizes for each layer of the network
*/
function SoftmaxNetwork (sizes) {
  return Network.call(this, sizes, SoftmaxLayer, LogLikelihood);
}

util.inherit(SoftmaxNetwork, LogLikelihood);

module.exports = SoftmaxNetwork;
