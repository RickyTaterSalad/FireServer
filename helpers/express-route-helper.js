var passportHelper = require("./passport-helper");
var passport = require('passport');
var initialize = function (app) {
//include auth
    app.use('/auth', require('../routes/auth'));
    //bring in api REST
    app.use('/api/v1/',passport.authenticate('basic', { session: false }), passportHelper.ensureAuthenticated, require("../routes/index"));
 //   app.use('/api/v1/', passportHelper.ensureAuthenticated, require("../routes/index"));
    app.get("/", function (req, res) {
        res.send("INDEX");
    });

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};
module.exports = {
    initialize: initialize
};
