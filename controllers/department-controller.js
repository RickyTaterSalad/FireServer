//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Department = require('mongoose').model('Department');


var getRandom = function () {
    return controllerUtils.getRandomDocument(Department);
};


var findById = function (/*ObjectId*/ id) {

};
var all = function () {

};

var exports = {
    findById: findById,
    all: all,
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;