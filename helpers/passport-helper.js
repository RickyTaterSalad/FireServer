var config = require('config');
var debug = require('debug')('fireServer:server');
var passport = require('passport');
var basicAuthProfileHelper = require("./http-auth-profile-helper");
var Account = require('mongoose').model('Account');
var BasicStrategy = require('passport-http').BasicStrategy;
/*
var GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy.Strategy;
var googleOauthConfig = config.get('auth.google');
var googleProfileHelper = require("./google-profile-helper");
*/
function ensureAuthenticated(req, res, next) {
    req.session.returnTo = req.originalUrl;
    if (req.isAuthenticated()) {
        debug("user is authenticated");
        return next();
    }
    debug("user is not authenticated");
    res.redirect('/auth/google');
}


var initialize = function () {
    debug("Creating basic strategy");
    passport.use(new BasicStrategy(
        function (userid, password, cb) {
            basicAuthProfileHelper.retrieveOrCreateAccount(userid).catch(function (e) {
                debug(e);
                cb(new Error("could not create account"), null);
            }).then(function (account) {
                cb(null, account);
            })
        }
    ));
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