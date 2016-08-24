var mongoose = require("mongoose");
var passport = require("passport");

var initialize = function (app) {
    app.use(require('express-session')({
        secret: 'rrmmExperience',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};

module.exports = {
    initialize: initialize
};