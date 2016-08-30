//model types passed can be either the instance itself or the object id


var controllerUtils = require("../util/controller-utils");
var driveTimeCacheController = require("../cache/drive-time-cache-controller");
var DriveTime = require('mongoose').model('DriveTime');
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var getRandom = function () {
    return controllerUtils.getRandomDocument(DriveTime);
};
var findByOriginStationAndDestination = function (/*ObjectId*/ originStation, /*ObjectId*/ destinationStation) {
    //check the redis cache first
    return driveTimeCacheController.get(originStation, destinationStation).then(function (driveTime) {
        if (driveTime) {
            return Promise.resolve(driveTime);
        }
        else {
            //go to db
            return DriveTime.findOne({
                originStation: originStation,
                destinationStation: destinationStation
            }).then(function (driveTime) {
                if (driveTime) {
                    driveTimeCacheController.add(driveTime);
                }
                return driveTime;
            });
        }
    });
};

var exports = {
    findByOriginStationAndDestination: findByOriginStationAndDestination
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
