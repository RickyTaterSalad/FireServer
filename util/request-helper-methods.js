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


var invalidRequestJson = {success: false, message: "Invalid Request"};
var noUserJson = {success: false, message: "Not Logged In"};
module.exports = {
    validObjectId: validObjectId,
    invalidRequestJson: invalidRequestJson,
    noUserJson: noUserJson,
    isDeploymentDepartment: isDeploymentDepartment
};