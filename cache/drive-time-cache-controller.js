var cacheController = require("./cache-controller");
var debug = require('debug')('fireServer:server');
var config = require('config');
var dbPrefix = "dt:";

var getAsObject = function (origin, destination) {
    if (!origin || !destination) {
        return Promise.resolve(null);
    }
    return get([origin, destination], true);
};
var get = function (driveTimeArray, returnObject) {
    if (!driveTimeArray || driveTimeArray.length != 2) {
     return Promise.resolve(null);
    }
    return cacheController.getObjectAsync(dbPrefix,driveTimeArray, returnObject);
};
var add = function (driveTime) {
    if (!driveTime) {
        return Promise.resolve(null);
    }
    var driveTimeArray = [driveTime.originStation, driveTime.destinationStation];
    return cacheController.setObject(dbPrefix,driveTimeArray, driveTime);
};
module.exports = {
    get: getAsObject,
    add: add
};