//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');
var controllerUtils = require("../util/controller-utils");
var driveTimeCacheController = require("../cache/drive-time-cache-controller");
var DriveTime = mongoose.model('DriveTime');
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var getRandom = function () {
    return controllerUtils.getRandomDocument(DriveTime);
};
var findByOriginStationAndDestination = function (/*ObjectId*/ originStation, /*ObjectId*/ destinationStation) {
    //check the redis cache first
    if(!originStation || !destinationStation || !mongoose.Types.ObjectId.isValid(originStation) || !mongoose.Types.ObjectId.isValid(destinationStation)){
        return Promise.resolve(null);
    }
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
