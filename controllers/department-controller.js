//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');
var controllerUtils = require("../util/controller-utils");
var Department = mongoose.model('Department');
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var getRandom = function () {
    return controllerUtils.getRandomDocument(Department);
};
var cachedDept = {};


var findByDepartmentName = function (/*String*/ departmentName) {
    if (!departmentName) {
        return Promise.resolve(null);
    }
    if (cachedDept[departmentName]) {
        return Promise.resolve(cachedDept[departmentName]);

    }
    else {
        return Department.findOne({
            name: departmentName
        }).then(function (department) {
            cachedDept = department;
            return department;
        });
    }
};
var exports = {
    findByDepartmentName: findByDepartmentName
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;
