var mongoose = require('mongoose');
var config = require('config');

var initialized = false;

var initialize = function () {
    if (initialized) {
        return;
    }
//setup mongoDB connection
    var dbURI = config.get('db.uri');

// Create the database connection
    mongoose.connect(process.env.MONGODB_URI || dbURI);
// CONNECTION EVENTS
// When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + dbURI);
    });

// If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

// When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

// If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
    //bring in the schema
    require('../models/all-schema');
    initialized = true;
    console.log("Initialized mongoose");
};


module.exports = {
    initialize: initialize
};