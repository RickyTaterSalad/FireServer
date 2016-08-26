//model types passed can be either the instance itself or the object id
var Post = require('mongoose').model('Post');

var controllerUtils = require("../util/controller-utils");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Post);
};

var findById = function (/*ObjectId*/ id) {

};

var allForUser = function (/*Account*/ user) {

};
var allForDate = function (/*Date*/ date) {

};
var allForDayMonthYear = function (day, month, year) {

};

var allForDateAtStation = function (/*Date */ date, /*Station*/ station) {

};


var exports = {
    findById: findById,
    allForUser: allForUser,
    allForDate: allForDate,
    allForDayMonthYear: allForDayMonthYear,
    allForDateAtStation: allForDateAtStation
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
