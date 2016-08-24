var mongoose = require("mongoose");
var passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var initialize = function (app) {
    //i have no ide what resave and saveUninitialized really does. might need to change this
    app.use(session({
        secret: 'rrMMExperience',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
    app.use(passport.initialize());
    //use mongo storage for session
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