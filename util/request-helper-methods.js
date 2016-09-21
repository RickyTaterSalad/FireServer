var util = require("util");
var debug = require('debug')('fireServer:server');
var config = require('config');
var deploymentDepartment = config.get("workingDepartment");
var validObjectId = function (id) {
    var res = (id != null && id.length > 0) ? id.match(/^[0-9a-fA-F]{24}$/) : false;
    if (!res) {
        debug(util.format("invalid format Object id passed: %s", id));
    }
    return res;

};
var isDeploymentDepartment = function (departmentName) {
    return deploymentDepartment === departmentName;
};

module.exports = {
    validObjectId: validObjectId,
    isDeploymentDepartment: isDeploymentDepartment
};