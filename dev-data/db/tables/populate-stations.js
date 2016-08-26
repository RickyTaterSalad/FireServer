var mongoose = require("mongoose");
var async = require('async');

//init mongoose
//require("../../../helpers/mongoose-helper").initialize();
var stationAddresses = require("../../station-data/station-address").addressLookupByStationId;
var stationGeoLocs = require("../../station-data/station-geolocation").geolocationLookupByStationId;
var stationNeighborhoods = require("../../station-data/station-neighborhood").neighborhoodLookupByStationId;
var Station = mongoose.model('Station');

var createStations = function (callback) {
    var fxns = [];
    for (var stationNum in stationAddresses) {
        if (!stationAddresses.hasOwnProperty((stationNum))) {
            continue;
        }
        var stationWithAddress = stationAddresses[stationNum];
        //should validate this exists
        var stationWithGeoLoc = stationGeoLocs[stationNum];
        var stationWithNeighborhood = stationNeighborhoods[stationNum];
        var newStation = new Station({
            stationNumber: stationNum,
            community: stationWithNeighborhood.neighborhood,
            street: stationWithAddress.address,
            city: stationWithAddress.city,
            state: stationWithAddress.state,
            zip: stationWithAddress.zip,
            stationCoordinate: {
                "type": "Point",
                "coordinates": [stationWithGeoLoc.longitude, stationWithGeoLoc.latitude]
            }
        });
        var err = newStation.validateSync();
        if (err) {
            console.log(JSON.stringify(newStation));
        }
        else {
            fxns.push(function (station, callback) {
                station.save(function (err) {
                    if (err) {
                        console.log("Couldn't save");
                        console.dir(err);
                    }
                    else {
                        console.log("created station");
                    }
                    callback();
                });
            }.bind(null, newStation));
        }
    }
    async.parallel(fxns, function () {
        console.log("stations complete");
        callback();
    });
};

module.exports = {
    createStations: createStations
};
