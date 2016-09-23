var cacheController = require("./cache-controller");
var debug = require('debug')('fireServer:server');
var dbPrefix = "pc:";

var getAsObject = function (calendarStart, destination) {
    if (!calendarStart || !cacheController.enabled()) {
        return Promise.resolve(null);
    }
    return get(calendarStart, true);
};
var get = function (calendarStart, returnObj) {
    if (!calendarStart || !cacheController.enabled()) {
        return Promise.resolve(null);
    }
    return cacheController.getObjectAsync(dbPrefix, calendarStart, returnObj);
};
var add = function (calendarStart, postCountObj) {
    if (!calendarStart || !cacheController.enabled()) {
        return Promise.resolve(null);
    }
    return cacheController.setObject(dbPrefix, calendarStart, postCountObj);
};
var remove = function (calendarStart) {
    if (calendarStart && cacheController.enabled()) {
        cacheController.remove(dbPrefix, calendarStart);
    }
};
module.exports = {
    get: getAsObject,
    add: add,
    remove: remove,
    enabled: cacheController.enabled,
    flush: cacheController.flush
};