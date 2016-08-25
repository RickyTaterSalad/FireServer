var mongoose = require("mongoose");
var async = require('async');

//init mongoose
require("../../helpers/mongoose-helper").initialize();
var stationAddresses = require("../station-data/station-address").addressLookupByStationId;
var stationGeoLocs = require("../station-data/station-geolocation").geolocationLookupByStationId;
var stationNeighborhoods = require("../station-data/station-neighborhood").neighborhoodLookupByStationId;
var Station = mongoose.model('Station');

var username = "fire";
var password = "fire";

var createStations = function () {
    var fxns = [];
    for (var stationNum in stationAddresses) {
        var stationWithAddress = stationAddresses[stationNum];
        //should validate this exists
        var stationWithGeoLoc = stationGeoLocs[stationNum];
        var stationWithNeighborhood = stationNeighborhoods[stationNum];
        var newStation = new Station({
            "stationNumber": stationNum,
            "community": stationWithNeighborhood.neighborhood,
            "street": stationWithAddress.address,
            "city": stationWithAddress.city,
            "state": stationWithAddress.state,
            "zip": stationWithAddress.zip,
            "stationCoordinate": {
                "type": "Point",
                "coordinates": [stationWithGeoLoc.longitude,
                    stationWithGeoLoc.latitude]
            }
        });
        var err = newStation.validateSync();
        if (err) {
            console.log("BROKE");
            console.log(JSON.stringify(newStation));
        }
        else {
            fxns.push(function (station, callback) {
                //console.log(newStation);
                station.save(function(err){
                    if(err){
                        console.log("Couldn't save");
                        console.dir(err);
                    }
                    callback();
                });
            }.bind(null, newStation));
        }
    }
    fxns.push(function (callback) {
        console.log("complete");
        callback();
        process.exit();
    });
    async.series(fxns);

};

createStations();
