var mongoose = require("mongoose");
var passport = require("passport");

var config = require('config');
var useRedis = config.get('redis.enabled');


var initialize = function (app) {
    app.use(passport.initialize());
};

module.exports = {
    initialize: initialize
};