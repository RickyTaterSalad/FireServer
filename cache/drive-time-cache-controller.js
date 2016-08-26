var cacheController = require("./cache-controller");
var debug = require('debug')('fireServer:server');
var config = require('config');
var useRedis = config.get('redis.enabled');
var dbId;
if(useRedis) {
    dbId = config.get('redis.dbLookup.driveTime');
}


var getAsObject = function (origin, destination) {
    if (!origin || !destination || !useRedis) {
        return Promise.resolve(null);
    }
    return get([origin, destination], true);
};
var get = function (driveTimeArray, returnObject) {
    if (!driveTimeArray || driveTimeArray.length != 2 || !useRedis) {
     return Promise.resolve(null);
    }
    return cacheController.getObjectAsync(dbId,driveTimeArray, returnObject);
};
var add = function (driveTime) {
    if (!driveTime || !useRedis) {
        return Promise.resolve(null);
    }
    var driveTimeArray = [driveTime.originStation, driveTime.destinationStation];
    return cacheController.setObject(dbId,driveTimeArray, driveTime);
};
module.exports = {
    get: getAsObject,
    add: add
};