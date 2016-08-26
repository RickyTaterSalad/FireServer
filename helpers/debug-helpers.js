var Promise = require("bluebird");
var Department = require('mongoose').model('Department');
var Station = require('mongoose').model('Station');

var defaultStation = function () {
    return new Promise(function (resolve, reject) {
        defaultDepartment().then(function (department) {
            if (department && department.stations && department.stations.length > 0) {
                resolve(department.stations[0]);
            }
            resolve(null);
        })
    });

};
var defaultDepartment = function () {
    return new Promise(function (resolve, reject) {
        Department.findOne({}).populate('Stations')
            .exec(function (err, department) {
                resolve(department);
            });
    });
};

module.exports = {
    defaultDepartment: defaultDepartment,
    defaultStation: defaultStation
};