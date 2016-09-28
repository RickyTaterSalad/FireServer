var jwtUtil = require("../util/jwt_util");
var passportHelper = require("./passport-helper");
var passport = require('passport');
var favicon = require('serve-favicon');
var debug = require('debug')('fireServer:server');
var jwt = require('express-jwt');
var initialize = function (app) {
    app.use(favicon(__dirname + '/../public/favicon.ico'));
    app.use('/auth', require('../routes/auth'));
    //bring in api REST
    app.use('/api/v1/', jwt({secret: jwtUtil.secretKey()}), passportHelper.ensureAuthenticated, require("../routes/index"));

    app.use('/department', require('../routes/department'));

    app.get("/", function (req, res) {
        res.send("INDEX");
    });
    app.use(function (req, res, next) {
        res.json({error: true, message: "not found"});
    });
    app.use(function (err, req, res, next) {

        debug("ERROR");
        debug(err);
        if (err.name === 'UnauthorizedError') {
            return res.status(401).send();
        }
        else {
            res.status(err.status || 500).send();
        }
    });
};
module.exports = {
    initialize: initialize
};
