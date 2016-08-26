//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Department = require('mongoose').model('Department');
var Promise = require("Bluebird");
var departmentCacheController = require("../cache/department-cache-controller");
var debug = require('debug')('fireServer:server');
var getRandom = function () {
    return controllerUtils.getRandomDocument(Department);
};
var findByDepartmentName = function (/*String*/ departmentName) {
    if (!departmentName) {
        return Promise.resolve(null);
    }
    return departmentCacheController.get(departmentName).then(function (department) {
        if (department) {
            debug("Returning department from cache");
            return Promise.resolve(department);
        }
        else {
            //go to db
            debug("hitting DB for department: " + departmentName);
            return Department.findOne({
                name: departmentName
            }).then(function (department) {
               departmentCacheController.add(department);
                return department;
            });
        }
    });
};
var all = function () {

};
var exports = {
    findByDepartmentName: findByDepartmentName,
    all: all
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;