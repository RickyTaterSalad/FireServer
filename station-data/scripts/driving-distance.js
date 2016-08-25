var distance = require('google-distance');
var async = require("async");
distance.apiKey = 'AIzaSyCIV379IS5XIdla1qjfB6nT5lwL8V_BiO8';
//distance.apiKey = 'AIzaSyA-mWMJ2s2Xf_81302TptOod3nTiYGxmY8
//distance.apiKey = 'AIzaSyA-mWMJ2s2Xf_81302TptOod3nTiYGxmY8';
//sophya distance.apiKey = 'AIzaSyAqh8F3kwvLQ-ouABlMDJwOX5jOOCMzg1Q';

//distance.apiKey = 'AIzaSyAqh8F3kwvLQ-ouABlMDJwOX5jOOCMzg1Q'

var fs = require('fs');
var stations = require("./../all-stations").stations;
console.log(stations["1"]["2"])
OUTFILE = "C:/temp/drivingDistance.json";

var fxns = [];
var latest = "";

var res = {};//require("./distances-partial-list").distances;
for (var i = 0; i < stations.length; i++) {
    for (var j = 0; j < stations.length; j++) {
        var firstStation = stations[i];
        var secondStation = stations[j];
        if (firstStation == secondStation) {
            continue;
        }
        console.log(firstStation.stationId + " " + secondStation.stationId);

        if (res[firstStation.stationId] == null) {
            res[firstStation.stationId] = {};
        }
        if (res[secondStation.stationId] == null) {
            res[secondStation.stationId] = {};
        }
        if (res[firstStation.stationId][secondStation.stationId] && res[secondStation.stationId][firstStation.stationId]) {
            console.log("already have values skipping");
           continue;
        }
        var fxn = function (station1, station2, callback) {
            if (res[station1.stationId][station2.stationId] && res[station2.stationId][station1.stationId]) {
                return callback();

            }

            if (res[station1.stationId][station2.stationId] || res[station2.stationId][station1.stationId]) {
                console.log("found in cache");
                if (res[station1.stationId][station2.stationId]) {
                    res[station1.stationId][station2.stationId] = res[station2.stationId][station1.stationId];
                }
                else {
                    res[station2.stationId][station1.stationId] = res[station1.stationId][station2.stationId];
                }
                return callback();

            }
            setTimeout(function () {
                distance.get(
                    {
                        origin: station1.address.toString(),
                        destination: station2.address.toString()
                    },
                    function (err, data) {
                        console.log("got response");
                        if (data) {
                            var obj = {
                                originStation: station1.stationId,
                                destinationStation: station2.stationId,
                                distance: data.distance,
                                distanceValue: data.distanceValue,
                                duration: data.duration,
                                durationValue: data.durationValue,
                                origin: data.origin,
                                destination: data.destination,
                                units: data.units
                            }
                            res[station1.stationId][station2.stationId] = obj;
                            res[station2.stationId][station1.stationId] = obj;
                        }
                        else {
                            console.log("could not calculate");
                            console.log(err);
                        }
                        latest = JSON.stringify(res);
                        callback();
                    }, 2000)
            });
        }.bind(null, firstStation, secondStation);
        fxns.push(fxn);
    }
}


fxns.push(
    function (callback) {
        console.log(JSON.stringify(res));
        fs.writeFile(OUTFILE, JSON.stringify(res), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            callback();
        });

    }
);
async.series(fxns);

