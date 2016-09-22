var redis = require("redis");
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var client = null;
var hasConnectionError = false;

if (process.env.REDISCLOUD_URL) {
    debug("Creating redis client");
    client = redis.createClient(process.env.REDISCLOUD_URL, {
        retry_strategy: function (options) {
            if (options.error.code == "ECONNREFUSED") {
                debug("redis disabled");
                hasConnectionError = true;
                return undefined;
            }
            return Math.max(options.attempt * 100, 3000);
        }
    }).on("error", function (err) {
        debug("Redis client connection error", err);
    }).on("connect", function () {
        debug("redis connected");
    });
}
var createKey = function (stringArray) {
    if (!stringArray) {
        return null;
    }
    return stringArray.join("-");
};


var _getObjectAsync = Promise.promisify(function (key, callback) {
    if (hasConnection()) {
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
    }
    else {
        callback(null);
    }
});
var setObject = function (dbPrefix, key, obj) {
    if (hasConnection()) {
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
    }
    else {
        return Promise.resolve(null);
    }
};
var getObjectAsync = function (dbPrefix, key, returnObject) {
    if (hasConnection()) {
        return _getObjectAsync(dbPrefix + key).catch(function (err) {
        }).then(function (data) {
            debug(data);
            return returnObject && data ? JSON.parse(data) : data;
        });
    }
    else {
        return Promise.resolve(null);
    }

};
var remove = function (dbPrefix, key) {
    if (dbPrefix && key && hasConnection()) {
        try {
            client.del(dbPrefix + key);
        }
        catch (err) {

        }
    }
};
var hasConnection = function () {
    return !hasConnectionError && client;
};
var flush = function () {
    if (hasConnection()) {
        client.flushdb(function (err, didSucceed) {
            if (err) {
                debug(err);
            }
            else {
                debug("flush cache response: " + didSucceed);
            }
        });
    }
}

module.exports = {
    getObjectAsync: getObjectAsync,
    setObject: setObject,
    createKey: createKey,
    enabled: hasConnection,
    remove: remove,
    flush: flush
};
