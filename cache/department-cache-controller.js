var cacheController = require("./cache-controller");
var debug = require('debug')('fireServer:server');
var config = require('config');
var useRedis = config.get('redis.enabled');
var dbPrefix = "dp:";
var getAsObject = function (departmentName) {
    if (!departmentName || !useRedis) {
        return Promise.resolve(null);
    }
    return get(departmentName, true);
};
var get = function (departmentName, returnObject) {
    if (!departmentName || !useRedis) {
        return Promise.resolve(null);
    }
    debug("cache - finding dept for key: " + departmentName);
    return cacheController.getObjectAsync(dbPrefix, departmentName, returnObject);

};
var add = function (department) {
    if (!department || !department.name || !useRedis) {
        return Promise.resolve(null);
    }
    debug("cache - storing dept: " + department.name);
    cacheController.setObject(dbPrefix, department.name, department);
};
module.exports = {
    get: getAsObject,
    add: add
};