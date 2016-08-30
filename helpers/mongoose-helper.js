var mongoose = require('mongoose');

//use moment for dates in mongo
require('mongoose-moment')(mongoose);

var config = require('config');
var debug = require('debug')('fireServer:server');
var initialized = false;

var initialize = function () {
    if (initialized) {
        return;
    }
//setup mongoDB connection
    var dbURI = config.get('db.uri');
    mongoose.Promise = require('bluebird');
// Create the database connection
    mongoose.connect(process.env.MONGODB_URI || dbURI);
// CONNECTION EVENTS
// When successfully connected
    mongoose.connection.on('connected', function () {
        debug('Mongoose default connection open to ' + dbURI);
    });

// If the connection throws an error
    mongoose.connection.on('error', function (err) {
        debug('Mongoose default connection error: ' + err);
    });

// When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        debug('Mongoose default connection disconnected');
    });

// If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            debug('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
    //bring in the schema
    require('../models');
    initialized = true;
    debug("Initialized mongoose");
};


module.exports = {
    initialize: initialize
};