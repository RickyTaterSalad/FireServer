//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var AssignHireCode = require('mongoose').model('AssignHireCode');


var getRandom = function () {
    return controllerUtils.getRandomDocument(AssignHireCode);
};

var findById = function (/*ObjectId*/ id) {

};
var findByDate = function (/*Date*/ date) {

};
var findByDayMonthYear = function (day, month, year) {

};
var exports = {
    findById: findById,
    findByDate: findByDate,
    findByDayMonthYear: findByDayMonthYear
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
