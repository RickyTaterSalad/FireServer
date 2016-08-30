var moment = require("moment");
var util = require("util");


//EVERYTHING IN UTC

var DAY = "day";
var UTC_TIME_ZONE_APPEND = "+0000";
var START_OF_DAY_UTC_APPEND = util.format("%s %s", "0:00:00", UTC_TIME_ZONE_APPEND);
var END_OF_DAY_UTC_APPEND = util.format("%s %s", "23:59:59", UTC_TIME_ZONE_APPEND);


var monthAsString = function (month) {
    if (!month) {
        return month;
    }
    var mStr = month + "";
    if (mStr.length == 1) {
        mStr = "0" + mStr;
    }
    return mStr;
};

//month starts at index 1!!!!!
var dateFromDayMonthYear = function (day, month, year, options) {
    var mStr = monthAsString(month);
    var append = null;
    if (options) {
        if (options.endOfDay) {
            append = END_OF_DAY_UTC_APPEND;
        }
    }
    if (!append) {
        append = START_OF_DAY_UTC_APPEND;
    }

    console.log([year, mStr, day].join("-"));
    return moment(util.format("%s %s",[year, mStr, day].join("-"),append));
};
//date in ms: 1472586908000
var dateFromMS = function (/*Number*/ dateInMs, /* {startOfDay:true|false,endOfDay:true|false} */options) {
    var date = moment.utc(dateInMs);
    if (options) {
        if (options.startOfDay) {
            date.minute(0);
            date.second(0);
            date.hour(0);
        }
        else if (options.endOfDay) {
            date.minute(59);
            date.second(59);
            date.hour(23);
        }
    }
    return date;
};
var isDateBeforeToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }
    return date.isBefore(moment().utc(), DAY);

};
var isDateToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }

    return date.isSame(moment().utc(), DAY);

};
var isDateAfterToday = function (/* Moment */ date) {
    if (!date) {
        return null;
    }
    return date.isAfter(moment().utc(), DAY);
};

module.exports = {
    dateFromMS: dateFromMS,
    dateFromDayMonthYear: dateFromDayMonthYear,
    isDateBeforeToday: isDateBeforeToday,
    isDateAfterToday: isDateAfterToday,
    isDateToday: isDateToday
};