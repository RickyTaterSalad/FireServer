var mongoose = require('mongoose');

var Station = mongoose.model('Station');
var controllerUtils = require("../util/controller-utils");
var Promise = require("bluebird");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Station);
};

var findById = function (/*ObjectId*/ id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return controllerUtils.byId(Station, id);
};
var stationForUser = function (/*Account */ account) {
    if (!account || !account.station) {
        return Promise.resolve(null);
    }
    return Station.findById(account.station);

};
var findByStationNumber = function (stationNumber) {
    if(!stationNumber){
        return Promise.resolve(null);
    }
    return Station.find({stationNumber: stationNumber});
};


var all = function (trimLeadingZerosFromStationNum) {
    return controllerUtils
            .all(Station)
            .sort({ stationNumber: 1 })
            .exec(function (err, stations) {
                if(trimLeadingZerosFromStationNum){
                    for(let station of stations){
                        //remove leading 0s of station
                        station.stationNumber = station.stationNumber.replace(/^0+/, '');
                    }
                }
                return stations;
            });
};

var exports = {
    findById: findById,
    findByUser: stationForUser,
    findByStationNumber: findByStationNumber,
    all: all
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
