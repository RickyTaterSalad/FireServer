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


var _getObjectAsync = Promise.promisify(function (dbId, key, callback) {
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
        client.select(dbId, function (err, res) {
            if (err) {
                debug("error setting redis db to id: " + dbId);
                callback();
            }
            else {
                client.get(key, callback);
            }
        });
    }
});
var setObject = function (dbId, key, obj) {
    if (client && key && obj) {
        if (key instanceof Array) {
            key = createKey(key);
            if (!key) {
                debug("cannot cache null key in redis");
                return;
            }
        }
        return client.select(dbId, function (err, res) {
            if (err) {
                debug("error setting redis db to id: " + dbId);
                return;
            }
            client.set(key, JSON.stringify(obj), redis.print);
            debug("cached object with key: " + key);
        });
    }
};
var getObjectAsync = function (dbId, key, returnObject) {
    return _getObjectAsync(dbId, key).catch(function (err) {
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