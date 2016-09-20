var jwtUtil = require("../util/jwt_util");
var passportHelper = require("./passport-helper");
var passport = require('passport');
var favicon = require('serve-favicon');
var jwt = require('express-jwt');
var initialize = function (app) {
//include auth
    app.use(favicon(__dirname + '/../public/favicon.ico'));
    app.use('/auth', require('../routes/auth'));
    //bring in api REST
    app.use('/api/v1/', jwt({secret: jwtUtil.secretKey()}),passportHelper.ensureAuthenticated, require("../routes/index"));
    // app.use('/api/v1/', passportHelper.ensureAuthenticated, require("../routes/index"));
    app.get("/", function (req, res) {
        res.send("INDEX");
    });

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.json({error:true,message:"not found"});
    });
};
module.exports = {
    initialize: initialize
};
