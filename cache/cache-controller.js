var redis = require("redis");
var crypto = require('crypto');
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

var createKey = function (stringArray) {
    if (!stringArray) {
        return null;
    }
    var combined = "";
    for (var i = 0; i < stringArray.length; i++) {
        combined += stringArray[i];
    }
    return crypto.createHash('md5').update(combined).digest('hex');
};
var setObject = function (key, obj) {
    if (client && key && obj) {
        if (key instanceof Array) {
            key = createKey(key);
            if (!key) {
                debug("cannot cache null key in redis");
                return;
            }
        }
        client.set(key, JSON.stringify(obj), redis.print);
        debug("cached object with key: " + key);
    }
};
var getObjectAsync = function (key, returnObject) {
    return _getObjectAsync(key).catch(function (err) {
    }).then(function (data) {
        return returnObject && data ? JSON.parse(data) : data;
    });

};
module.exports = {
    getObjectAsync: getObjectAsync,
    setObject: setObject,
    createKey: createKey
};