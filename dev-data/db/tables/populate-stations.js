var mongoose = require("mongoose");
var async = require('async');

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
            console.log("could not create station")
            console.log(err);
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
