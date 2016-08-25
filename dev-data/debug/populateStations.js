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

var createStations = function(){
    console.log('Creating Stations ...');

    for(var stationNum in stationAddresses){

        var stationWithAddress = stationAddresses[stationNum];
        console.log(stationNum);
        //should validate this exists
        var stationWithGeoLoc = stationGeoLocs[stationNum];
        var stationWithNeighborhood = stationNeighborhoods[stationNum];

        var newStation = new Station({
            "stationNumber" : stationNum,
            "community" : stationWithNeighborhood.neighborhood,
            "street" : stationWithAddress.address,
            "city" : stationWithAddress.city,
            "state" : stationWithAddress.state,
            "zip" : stationWithAddress.zip,
            "stationCoordinate": {  "type": "Point",
                                    "coordinates": [stationWithGeoLoc.longitude,
                                                    stationWithGeoLoc.latitude]}
        });

        //console.log(newStation);
        newStation.save(function(err){
            if (err) {
                    console.log(err);
                    return;
            }
        });

    }
}

createStations();
