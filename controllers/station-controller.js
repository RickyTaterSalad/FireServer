//model types passed can be either the instance itself or the object id
var Station = require('mongoose').model('Station');
var controllerUtils = require("../util/controller-utils");
var Promise = require("bluebird");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Station);
};

var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Station,id);
};
var stationForUser = function (/*Account */ account) {
    if(!account || !account.station){
       return  Promise.resolve(null);
    }
    return Station.findById(account.station);

};
var findByStationNumber = function (stationNumber) {
    return  Station.find({stationNumber: stationNumber});
};
var all = function () {
   return controllerUtils.all(Station);
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
