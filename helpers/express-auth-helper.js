var mongoose = require("mongoose");
var passport = require("passport");
const session = require('express-session');

var config = require('config');
var useRedis = config.get('redis.enabled');

var initialize = function (app) {
    //i have no ide what resave and saveUninitialized really does. might need to change this
    if (useRedis) {
        const dbIdx = config.get('redis.sessionStoreDb');
        const RedisStore = require('connect-redis')(session);
        app.use(session({
            store: new RedisStore({db :dbIdx}),
            secret: 'rrMMExperience'
        }));
    }
    else {
        const MongoStore = require('connect-mongo')(session);
        app.use(session({
            secret: 'rrMMExperience',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
    }
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