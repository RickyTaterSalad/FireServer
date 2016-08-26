//model types passed can be either the instance itself or the object id
var Station = require('mongoose').model('Station');
var controllerUtils = require("../util/controller-utils");
var Promise = require("Bluebird");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Station);
};

var findById = function (/*ObjectId*/ id) {

};
var findByUser = function (/*Account */ account) {

};
var findByStationNumber = function (stationNumber) {
    return Promise.try(function () {
        return Station.find({stationNumber: stationNumber});
    });
};
var all = function () {
    return Promise.try(function () {
        return Station.find({});
    });
};

var exports = {
    findById: findById,
    findByUser: findByUser,
    findByStationNumber: findByStationNumber,
    all: all
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
