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
