var redis = require("redis");
var Promise = require("Bluebird");
var debug = require('debug')('fireServer:server');
var config = require('config');
var useRedis = config.get('redis.enabled');
var client = null;

if (useRedis) {
    debug("Creating redis client");
    client = redis.createClient().on("error", function (err) {
        debug("Redis client connection error", err);
    });
}
var createKey = function (stringArray) {
    if (!stringArray) {
        return null;
    }
    return stringArray.join("-");
};


var _getObjectAsync = Promise.promisify(function (key, callback) {
    if (!key) {
        callback("No Key Present");
    }
    else if (!client) {
        callback("No Redis connection available");
    }
    else {
        if (key instanceof Array) {
            key = createKey(key);
        }
        client.get(key, callback);
    }
});
var setObject = function (dbPrefix, key, obj) {
    if (client && key && obj) {
        if (key instanceof Array) {
            key = createKey(key);
            if (!key) {
                debug("cannot cache null key in redis");
                return;
            }
        }
        client.set(dbPrefix + key, JSON.stringify(obj), redis.print);
        debug("cached object with key: " + key);
    }
};
var getObjectAsync = function (dbPrefix, key, returnObject) {
    return _getObjectAsync(dbPrefix + key).catch(function (err) {
    }).then(function (data) {
        debug(data);
        return returnObject && data ? JSON.parse(data) : data;
    });

};
module.exports = {
    getObjectAsync: getObjectAsync,
    setObject: setObject,
    createKey: createKey
};