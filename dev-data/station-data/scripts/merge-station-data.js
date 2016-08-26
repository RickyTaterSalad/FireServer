var stationAddresses = require("../base-data/station-address").addressLookupByStationId;
var stationGeolocation = require("../base-data/station-geolocation").geolocationLookupByStationId;
var stationNeighborhood = require("../base-data/station-neighborhood").neighborhoodLookupByStationId;


var res = [];

for (var key in stationAddresses) {
    var addObj = stationAddresses[key];
    var geolocObj = stationGeolocation[key];
    var neighObj = stationNeighborhood[key];

    var stationObject = {
        street: addObj.address,
        city: addObj.city,
        state: addObj.state,
        zip: addObj.zip,
        stationCoordinate: {
            type: "Point",
            coordinates: [geolocObj.longitude, geolocObj.latitude]
        },
        community: neighObj.neighborhood,
        stationNumber: key
    };
    res.push(stationObject);
}

console.log(JSON.stringify(res));