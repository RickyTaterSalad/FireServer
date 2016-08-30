var moment = require("moment");
//EVERYTHING IN UTC


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
var isDateBeforeToday = function (/* Moment */ date){
    if(!date){
        return null;
    }
    return date.isBefore(moment().utc(),"day");

};
var isDateToday = function (/* Moment */ date){
    if(!date){
        return null;
    }
    return now.isSame(moment().utc(),"day");

};
var isDateAfterToday = function (/* Moment */ date){
    if(!date){
        return null;
    }
    return date.isAfter(moment().utc(),"day");
};

module.exports = {
    dateFromMS: dateFromMS,
    isDateBeforeToday: isDateBeforeToday,
    isDateAfterToday: isDateAfterToday,
    isDateToday: isDateToday
};