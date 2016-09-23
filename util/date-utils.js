var moment = require("moment");
var util = require("util");
var debug = require('debug')('fireServer:server');
//EVERYTHING IN UTC

var DAY = "day";




var getCalendarKeysForShift = function (/*Number*/ dateInMs) {
    var dateMoment = dateFromMS(dateInMs, {startOfDay: true});
    console.log("shift Date: " + dateMoment.toString());
    if (!dateMoment) {
        debug("bad moment");
        return null;
    }
    var keys = [];
    var startOfMonthMoment = dateMoment.clone().date(1);
    console.log("first day of month for shidt: " +startOfMonthMoment.toString());
    var dayOfTheWeekOffset = startOfMonthMoment.day();
    console.log("first day offset: " + dayOfTheWeekOffset);
    startOfMonthMoment.date(startOfMonthMoment.date() - dayOfTheWeekOffset);
    //key for the calendar view of the current month the shift falls in
    console.log("pushign current month moment: " +startOfMonthMoment.toString());

    var previousMomentCalendarStart = dateMoment.clone().subtract(1,"month").date(1);

    dayOfTheWeekOffset = previousMomentCalendarStart.day();
    previousMomentCalendarStart.date(previousMomentCalendarStart.date() - dayOfTheWeekOffset);
    //key for the previous month if it displays the calendar
    console.log("pushign previous month moment: " +previousMomentCalendarStart.toString());

    var nextMomentCalendarStart = dateMoment.clone().add(1,"month").date(1);

    dayOfTheWeekOffset = nextMomentCalendarStart.day();
    nextMomentCalendarStart.date(nextMomentCalendarStart.date() - dayOfTheWeekOffset);
    //key for the next month if it displays the calendar
    console.log("pushign next month moment: " +nextMomentCalendarStart.toString());
    keys.push(startOfMonthMoment.valueOf());
    keys.push(previousMomentCalendarStart.valueOf());
    keys.push(nextMomentCalendarStart.valueOf());
    console.dir(keys);


    return keys;

};

//month is passed with january as 1. we decrement internally
var dateFromDayMonthYear = function (day, month, year) {
    if (!day || (!month && month != 0) || !year) {
        return null;
    }
    try {
        var obj = {year: year, month: month - 1, day: day};
        debug(JSON.stringify(obj));
        return moment.utc(obj);
    }
    catch (err) {
        return null;
    }
};
//date in ms: 1472586908000 /* {startOfDay:true|false,endOfDay:true|false} */
var dateFromMS = function (/*Number*/ dateInMs, options) {
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
    todayUtc: todayUtc,
    getCalendarKeysForShift: getCalendarKeysForShift
};