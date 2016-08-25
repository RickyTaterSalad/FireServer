//model types passed can be either the instance itself or the object id

var findById = function (/*ObjectId*/ id) {

};

var allForUser = function (/*Account*/ user) {

};
var allForDate = function (/*Date*/ date) {

};
var allForDayMonthYear = function (day, month, year) {

};

var allForDateAtStation = function(/*Date */ date, /*Station*/ station){

};

module.exports = {
    findById: findById,
    allForUser: allForUser,
    allForDate: allForDate,
    allForDayMonthYear: allForDayMonthYear,
    allForDateAtStation: allForDateAtStation
};