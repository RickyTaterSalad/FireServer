//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var AssignHireCode = require('mongoose').model('AssignHireCode');
var debug = require('debug')('fireServer:server');


var getRandom = function () {
    return controllerUtils.getRandomDocument(AssignHireCode);
};

var getAllAHCodes = function(){
    return AssignHireCode
        .find()
        .sort('-ahCode')
        .then(function(codes){
            return codes;
        })
        .catch(function(err){
            return err;
        });
}

var findById = function (/*ObjectId*/ id) {
    if(!id){
        return Promise.resolve(null);
    }

    return AssignHireCode.findById({
        id
    }).then(function(ahCode){
        return ahCode;
    });
};

var findByCode = function (/*String*/ code) {
    debug(code);
    if(!code){
        return Promise.resolve(null);
    }

    return AssignHireCode
            .findOne({'ah_code' : code})
            .then(function(ahCode){
                debug(ahCode);
                return ahCode;
             })
            .catch(function(err){
                return err;
            });
};

var findByDate = function (/*Date*/ date) {
    if(!date){
        return Promise.resolve(null);
    }

    AssignHireCode.find({
        'shifts.start' : date
    }).then(function(err, ahCodeResults){
        if(err) return err;
        return ahCodeResults;
    });
};

var findByDayMonthYear = function (day, month, year) {

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
