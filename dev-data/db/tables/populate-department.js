var Department = require("mongoose").model('Department');
var debug = require('debug')('fireServer:server');
var createDepartment = function (callback) {
    debug("Create dept");
    var dept = new Department(require("../../station-data/department").department);
    var err = dept.validateSync();
    if (err) {
        debug("generated invalid department");
        debug(err);
        callback();
    }
    else {
        dept.save(callback);
    }
};
module.exports = {
    createDepartment: createDepartment
};