//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');
var controllerUtils = require("../util/controller-utils");
var AssignHireCode = mongoose.model('AssignHireCode');
var debug = require('debug')('fireServer:server');
var dateUtils = require("../util/date-utils");
var moment = require('moment');

var getRandom = function () {
    return controllerUtils.getRandomDocument(AssignHireCode);
};

var getAllAHCodes = function () {
    return AssignHireCode
        .find()
        .sort('-ahCode')
        .then(function (codes) {
            return codes;
        })
        .catch(function (err) {
            return err;
        });
};

var findById = function (/*ObjectId*/ id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return controllerUtils.byId(AssignHireCode, id);
};

var findByCode = function (/*String*/ code) {
    debug(code);
    if (!code) {
        return Promise.resolve(null);
    }

    return AssignHireCode
        .findOne({'ah_code': code})
        .then(function (ahCode) {
            debug(ahCode);
            return ahCode;
        })
        .catch(function (err) {
            return Promise.resolve(err);
        });
};

var findByDate = function (/*Date*/ date) {
    if (!date) {
        return Promise.resolve(null);
    }

    var searchDate = moment(date);
    var nextDay = searchDate.clone().add(1, 'day');

    return AssignHireCode
        .find({
            'shifts.start': {
                '$gte': searchDate.format(),
                '$lt': nextDay.format()
            }
        })
        .then(function (ahCodeResults) {
            return ahCodeResults;
        })
        .catch(function (err) {
            return Promise.resolve(null);
        });
};

var findByDayMonthYear = function (day, month, year) {
    if (!day || (!month && month != 0) || !year) {
        return Promise.resolve([]);
    }
    else {
        return findByDate(dateUtils.dateFromDayMonthYear(day, month, year));
    }
};

var exports = {
    findById: findById,
    findByDate: findByDate,
    findByCode: findByCode,
    findByDayMonthYear: findByDayMonthYear,
    getAllAHCodes: getAllAHCodes
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
