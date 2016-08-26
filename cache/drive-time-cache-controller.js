var cacheController = require("./cache-controller");
var cachePrepend = "dt-";
var debug = require('debug')('fireServer:server');

var getAsObject = function (origin, destination) {
    if (!origin || !destination) {
        return Promise.resolve(null);
    }
    return get([origin, destination], true);
};
var get = function (driveTimeArray, returnObject) {
    if (!driveTimeArray || driveTimeArray.length != 2) {
        return null;
    }
    driveTimeArray = [cachePrepend, driveTimeArray[0], driveTimeArray[1]];
    return cacheController.getObjectAsync(driveTimeArray, returnObject);
};
var add = function (driveTime) {
    if (!driveTime) {
        return null;
    }
    var driveTimeArray = [cachePrepend, driveTime.originStation, driveTime.destinationStation];
    return cacheController.setObject(driveTimeArray, driveTime);
};
module.exports = {
    get: getAsObject,
    add: add
};