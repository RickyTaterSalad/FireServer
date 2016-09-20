var config = require('config');
var debug = require('debug')('fireServer:server');
var passport = require('passport');
var googleAuthHelper = require("./google-profile-helper");
var Account = require('mongoose').model('Account');
var GoogleIdTokenStrategy = require('passport-google-idtoken');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        debug("user is authenticated");
        return next();
    }
    debug("user is not authenticated");
    return res.status(401).send("Not Logged In");
}


var initialize = function () {
    debug("Creating google id strategy");
    passport.use(
        new GoogleIdTokenStrategy(
            {}, //use the default configuration. this should be perfectly usable.
            function(profile, cb) {
                googleAuthHelper.retrieveOrCreateAccount(profile).then(function(account){
                    cb(null,account);
                });
            }
        )
    );

};



module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    initialize: initialize
};