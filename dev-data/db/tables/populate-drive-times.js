var async = require('async');
var convert = require('convert-units');
var util = require("util");
var allDriveTimes = require("../../station-data/all-driving-distances").distances;
var DriveTime = require("mongoose").model('DriveTime');
var stationController = require("../../../controllers/station-controller");

var Promise = require("Bluebird");

var generateCreateFunction = function (params) {
    return function (params, callback) {
        // console.log(util.format("%s - %s"), params.originAddress, params.destinationAddress);
        DriveTime.create(params, function (err) {
            if (err) {
                console.log("error creating drive time");
            }
            else {
                console.log("created drive time");
            }
            callback()
        });
    }.bind(null, params);
};

var getStation = function (stationNumber) {
    return Promise.try(function () {
        if (stationIdByStationNumber[stationNumber]) {
            console.log("found station " + stationNumber + " in cache");
            return stationIdByStationNumber[stationNumber];
        }
        else {
            console.log("hitting db for station " + stationNumber);
            return stationController.findByStationNumber((stationNumber))
        }
    })
};

var writeDriveTimesToDb = function (stationLookup,callback) {
    console.log("creating drive times... THIS CAN TAKE A WHILE");
    var stationFunctionsCreated = {};
    var fxns = [];
    for (var key in allDriveTimes) {
        var currentDriveTimes = allDriveTimes[key];
        for (var targetStationKey in currentDriveTimes) {
            var driveTime = currentDriveTimes[targetStationKey];
            var originAddress = driveTime.origin;
            var destinationAddress = driveTime.destination;
            if (!stationFunctionsCreated[originAddress]) {
                stationFunctionsCreated[originAddress] = {};
            }
            if (!stationFunctionsCreated[destinationAddress]) {
                stationFunctionsCreated[destinationAddress] = {};
            }
            var createDriveTime1 = true;
            var createDriveTime2 = true;
            if (stationFunctionsCreated[originAddress][destinationAddress]) {
                createDriveTime1 = false;
            }
            if (stationFunctionsCreated[destinationAddress][originAddress]) {
                createDriveTime2 = false;
            }
            var distanceFootConvert = convert(driveTime.distanceValue).from('m').to('ft');
            var distanceMetricStringConvert = convert(driveTime.distanceValue).from('m').toBest();
            var distanceImperialStringConvert = convert(distanceFootConvert).from('ft').toBest();

            var distanceFeet = Math.floor(distanceFootConvert);
            var distanceMetricVal = Math.floor(distanceMetricStringConvert.val);
            var distanceImperialVal = Math.floor(distanceImperialStringConvert.val);

            var distanceMetricString = "";
            var distanceImperialString = "";

            if (distanceMetricVal != 1) {
                distanceMetricString = util.format("%s %s", distanceMetricVal, distanceMetricStringConvert.plural);
            }
            else {
                distanceMetricString = util.format("%s %s", distanceMetricVal, distanceMetricStringConvert.singular);
            }
            if (distanceImperialVal != 1) {
                distanceImperialString = util.format("%s %s", distanceImperialVal, distanceImperialStringConvert.plural);
            }
            else {
                distanceImperialString = util.format("%s %s", distanceImperialVal, distanceImperialStringConvert.singular);
            }

            var driveTimeParams1 = {
                originStation: stationLookup[driveTime.originStation]._id,
                destinationStation: stationLookup[driveTime.destinationStation]._id,
                originAddress: originAddress,
                destinationAddress: destinationAddress,
                distanceStringMetric: distanceMetricString,
                distanceStringImperial: distanceImperialString,
                distanceMeters: driveTime.distanceValue,
                distanceFeet: distanceFeet,
                originCoordinate: {"type": "Point", "coordinates": [100.0, 0.0]},
                destinationCoordinate: {"type": "Point", "coordinates": [100.0, 0.0]},
                duration: driveTime.durationValue
            };
            //other direction
            var driveTimeParams2 = JSON.parse(JSON.stringify(driveTimeParams1));
            var originCoordinate = driveTimeParams1.originCoordinate;
            driveTimeParams2.originAddress = destinationAddress;
            driveTimeParams2.destinationAddress = originAddress;
            driveTimeParams2.originCoordinate = driveTimeParams1.destinationCoordinate;
            driveTimeParams2.destinationCoordinate = originCoordinate;
            driveTimeParams2.originStation = driveTimeParams1.destinationStation;
            driveTimeParams2.destinationStation = driveTimeParams1.originStation;

            if (createDriveTime1) {
                fxns.push(generateCreateFunction(driveTimeParams1));
                stationFunctionsCreated[originAddress][destinationAddress] = true;
            }
            if (createDriveTime2) {
                fxns.push(generateCreateFunction(driveTimeParams2));
                stationFunctionsCreated[destinationAddress][originAddress] = true;
            }

        }
    }
    //run the functions
    async.parallel(fxns, function (err, results) {
        console.log("created drive times");
        callback();
    });
};

var createDriveTimes = function (callback) {
    stationController.all().then(function(allStations){
      var stationLookup = {};
        for(var i =0 ; i < allStations.length;i++){
            stationLookup[allStations[i].stationNumber] = allStations[i];
        }
        writeDriveTimesToDb(stationLookup,callback);
    });

};
module.exports = {
    createDriveTimes: createDriveTimes
};
