var moment = require("moment");
var util = require("util");
var debug = require('debug')('fireServer:server');
//EVERYTHING IN UTC

var DAY = "day";

//month is passed with january as 1. we decrement internally
var dateFromDayMonthYear = function (day, month, year) {
    if (!day || (!month && month != 0) || !year) {
        return null;
    }
    try {
        var obj = {year: year,month: month - 1 ,day:day};
        debug(JSON.stringify(obj));
        return moment.utc(obj);
    }
    catch (err) {
        return null;
    }
};
//date in ms: 1472586908000
var dateFromMS = function (/*Number*/ dateInMs, /* {startOfDay:true|false,endOfDay:true|false} */options) {
    if (!dateInMs) {
        return null;
    }
    var date = moment.utc(dateInMs);
    if (options) {
        if (options.startOfDay) {
            date.minute(0);
            date.second(0);
            date.hour(0);
            date.millisecond(0);
        }
        else if (options.endOfDay) {
            date.minute(59);
            date.second(59);
            date.hour(23);
            date.millisecond(999);
        }
    }
    return date;
};
var isDateBeforeToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }
    return date.isBefore(todayUtc(), DAY);

};
var isDateToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }

    return date.isSame(todayUtc(), DAY);

};
var isDateAfterToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }
    return date.isAfter(todayUtc(), DAY);
};
var todayUtc = function () {
    return moment().utc();
};

module.exports = {
    dateFromMS: dateFromMS,
    dateFromDayMonthYear: dateFromDayMonthYear,
    isDateBeforeToday: isDateBeforeToday,
    isDateAfterToday: isDateAfterToday,
    isDateToday: isDateToday,
    todayUtc: todayUtc
};