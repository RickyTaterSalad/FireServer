var mongoose = require("mongoose");
var async = require('async');
var debug = require('debug')('fireServer:server');
//init mongoose
//require("../../../helpers/mongoose-helper").initialize();
const stations = require("../../station-data/all-stations").stations;
var Station = mongoose.model('Station');

var createStations = function (callback) {
    var fxns = [];
    for (var i = 0; i < stations.length; i++) {
        var newStation = new Station(stations[i]);
        var err = newStation.validateSync();
        if (err) {
            debug("could not create station")
            debug(err);
        }
        else {
            //add leading 0s to station number for sort capability
            if(!Number.isNaN(newStation.stationNumber)){
                //ignore non-numerical e.g. special duty

                console.log("Station Number:" + newStation.stationNumber);
                var originalStationNumLength = newStation.stationNumber.length;
                for(var j = 0; j < 3 - originalStationNumLength; j++){
                    newStation.stationNumber = "0" + newStation.stationNumber;
                    console.log("Padded station number:" + newStation.stationNumber);
                }
            }

            fxns.push(function (station, callback) {
                station.save(function (err) {
                    if (err) {
                        debug("Couldn't save station");
                        debug(err);
                    }
                    else {
                        debug("created station");
                    }
                    callback();
                });
            }.bind(null, newStation));
        }
    }
    async.parallel(fxns, function () {
        debug("stations complete");
        callback();
    });
};

module.exports = {
    createStations: createStations
};
