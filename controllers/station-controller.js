//model types passed can be either the instance itself or the object id
var Promise = require("bluebird");
var Station = require('mongoose').model('Station');
var controllerUtils = require("../util/controller-utils");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Station);
};

var findById = function (/*ObjectId*/ id) {

};
var findByUser = function (/*Account */ account) {

};

var exports = {
    findById: findById,
    findByUser: findByUser
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
