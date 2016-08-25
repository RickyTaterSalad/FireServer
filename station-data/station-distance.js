var stations = require("./all-stations").stations

var OUTFILE = "C:/temp/distances.json";


var fs = require('fs');
var geolib = require("geolib");
var res = {}
for (var i = 0; i < stations.length; i++) {
    for (var j = 0; j < stations.length; j++) {
        var firstStation = stations[i];
        var secondStation = stations[j];
        if (firstStation == secondStation) {
            continue;
        }
        if (res[firstStation.stationId] == null) {
            res[firstStation.stationId] = {};
        }
        if (res[secondStation.stationId] == null) {
            res[secondStation.stationId] = {};
        }
        if (!res[firstStation.stationId][secondStation.stationId] || !res[secondStation.stationId][firstStation.stationId]) {
            var distance = geolib.getDistance(firstStation, secondStation);
            console.log(JSON.stringify(distance));
            if (!res[firstStation.stationId][secondStation.stationId]) {
                res[firstStation.stationId][secondStation.stationId] = distance;
            }
            if (!res[secondStation.stationId][firstStation.stationId]) {
                res[secondStation.stationId][firstStation.stationId] = distance;
            }
        }
    }
}

fs.writeFile(OUTFILE, JSON.stringify(res), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
