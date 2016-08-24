var config = require('config');
var googleProfileHelper = require("./google-profile-helper");
var basicAuthProfileHelper = require("./http-auth-profile-helper");
var googleOauthConfig = config.get('auth.google');
var passport = require('passport');

var Account = require('mongoose').model('Account');

var BasicStrategy = require('passport-http').BasicStrategy;
var GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy.Strategy;

function ensureAuthenticated(req, res, next) {
    req.session.returnTo = req.originalUrl;
    if (req.isAuthenticated()) {
        console.log("user is authenticated");
        return next();
    }
    console.log("user is not authenticated");
    res.redirect('/auth/google');
}


var initialize = function () {
    console.log("Creating basic strategy");
    passport.use(new BasicStrategy(
        function (userid, password, cb) {
            basicAuthProfileHelper.retrieveOrCreateAccount(userid).catch(function (e) {
                console.dir(e);
                cb(new Error("could not create account"), null);
            }).then(function (account) {
                cb(null, account);
            })
        }
    ));

    passport.use(new GoogleOAuth2Strategy({
            clientID: googleOauthConfig.clientId,
            clientSecret: googleOauthConfig.clientSecret,
            callbackURL: googleOauthConfig.callbackURL
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log("Got Token: " + JSON.stringify(profile));
            googleProfileHelper.retrieveOrCreateAccount(profile).catch(function (e) {
                console.dir(e);
                cb(new Error("could not create account"), null);
            }).then(function (account) {
                cb(null, account);
            })

        }
    ))
    ;
}


module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    initialize: initialize
}