var express = require('express');
var path = require("path");
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require("cors");


var initialize = function () {
    var app = express();
    app.set('json spaces', 2);
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    // app.use(cookieParser());
    app.use(cors());
    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');



    return app;

};
module.exports = {

    initialize: initialize
};