//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var DriveTime = require('mongoose').model('DriveTime');
var Promise = require("Bluebird");

var getRandom = function () {
    return controllerUtils.getRandomDocument(DriveTime);
};


var findByOriginStationAndDestination = function (/*ObjectId*/ originStation, /*ObjectId*/ destinationStation) {
    return Promise.try(function(){
        return DriveTime.find({originStation:originStation,destinationStation:destinationStation});
    });
};

var exports = {
    findByOriginStationAndDestination: findByOriginStationAndDestination
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;