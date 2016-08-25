var mongoose = require("mongoose");
var async = require('async');

require("../../helpers/mongoose-helper").initialize();

var allDriveTimes = require("../station-data/all-driving-distances").distances;

var DriveTime = mongoose.model('DriveTime');


/*

 {
 "originStation": "1",
 "destinationStation": "2",
 "distance": "3.3 km",
 "distanceValue": 3298,
 "duration": "5 mins",
 "durationValue": 292,
 "origin": "2230 Pasadena Ave, Los Angeles, CA 90031, USA",
 "destination": "1962 East Cesar E Chavez Avenue, Los Angeles, CA 90033, USA",
 "units": "metric"
 }


 */
var mappingsCompletes = {};
var stationFunctionsCreated = {};
var fnx = [];

var feetInAMeter = 3.280839895;

var run = function () {
    for (var key in allDriveTimes) {
        var currentDriveTimes = allDriveTimes[key];
        for (var targetStationKey in currentDriveTimes) {
            var driveTime = currentDriveTimes[targetStationKey];


            if (!stationFunctionsCreated[originAddress]) {
                stationFunctionsCreated[originAddress] = {};
            }
            if (!stationFunctionsCreated[destination]) {
                stationFunctionsCreated[destination] = {};
            }
            var createDriveTime1 = true;
            var createDriveTime2 = true;
            if (stationFunctionsCreated[originAddress][destination]) {
                createDriveTime1 = false;
            }
            if (stationFunctionsCreated[destination][originAddress]) {
                createDriveTime2 = false;
            }

            var driveTimeParams1 = {
                // originStation: ,
                // destinationStation: ,
                originAddress: driveTime.origin,
                destinationAddress: driveTime.destination,
                distanceStringMetric: driveTime.distance,
                distanceStringImperial: driveTime.distance,
                distanceMetric: driveTime.distanceValue,
                distanceImperial: Math.floor(driveTime.distanceValue * feetInAMeter),
                duration: driveTime.durationValue
            };

            //other direction
            var driveTimeParams2 = JSON.parse(JSON.stringify(driveTimeParams1));
            driveTimeParams2.originAddress = driveTime.destination;
            driveTimeParams2.destinationAddress = driveTime.origin;
            driveTimeParams2.originStation = driveTime.destinationStation;
            driveTimeParams2.destinationStation = driveTime.originStation;

            if (createDriveTime1) {
                fnx.push(function (driveTimeParams1) {


                }.bind(null, driveTimeParams1));
            }
            if (createDriveTime2) {
                fnx.push(function (driveTimeParams2) {


                }.bind(null, driveTimeParams2));
            }
        }
    }
};

module.exports = {
    run: run
}

//remove if called from other scripts
run();