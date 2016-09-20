var config = require('config');
var debug = require('debug')('fireServer:server');
var passport = require('passport');
var basicAuthProfileHelper = require("./http-auth-profile-helper");
var googleAuthHelper = require("./google-profile-helper");
var Account = require('mongoose').model('Account');
var BasicStrategy = require('passport-http').BasicStrategy;
var GoogleIdTokenStrategy = require('passport-google-idtoken');

/*
var GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy.Strategy;
var googleOauthConfig = config.get('auth.google');
var googleProfileHelper = require("./google-profile-helper");
*/
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
/*
    passport.use(new BasicStrategy(
        function (userid, password, cb) {
            debug("BASIC STRAT");
            basicAuthProfileHelper.retrieveOrCreateAccount(userid).catch(function (e) {
                debug(e);
                cb(new Error("could not create account"), null);
            }).then(function (account) {
                cb(null, account);
            })
        }
    ));
    */

/*
    passport.use(new GoogleOAuth2Strategy({
            clientID: googleOauthConfig.clientId,
            clientSecret: googleOauthConfig.clientSecret,
            callbackURL: googleOauthConfig.callbackURL
        },
        function (accessToken, refreshToken, profile, cb) {
            debug("Got Token: " + JSON.stringify(profile));
            googleProfileHelper.retrieveOrCreateAccount(profile).catch(function (e) {
                cb(new Error("could not create account"), null);
            }).then(function (account) {
                cb(null, account);
            })

        }
    ));
    */

}



module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    initialize: initialize
}