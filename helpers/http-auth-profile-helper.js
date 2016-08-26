var Account = require('mongoose').model('Account');
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var retrieveOrCreateAccount = function (username) {
    return new Promise(function (resolve, reject) {
        var params = {
            "localAuthUid": username
        };
        Account.findOne(params, function (err, user) {
            if (user == null) {
                debug("Creating account");
                return createAccount(username).catch(function (e) {
                    debug("got reject in retrieveOrCreateAccount");
                    reject(e);
                }).then(function (user) {
                    debug("got account in retrieveOrCreateAccount");
                    resolve(user);
                })
            }
            else {
                debug("found user in DB");
                resolve(user);

            }
        });
    });
};
//this assumes the user does not exist
var createAccount = function (username) {
    return new Promise(function (resolve, reject) {
        //create
        var params = {
            localAuthUid: username,
            firstName: username,
            lastName: username,
            email: "test@gmail.com"
        };
        Account.create(params, function (err, user) {
                if (err) {
                    debug("Caught error in create google account");
                    debug(err);
                }
                err ? reject(err) : resolve(user);
            }
        )
    });
};

module.exports = {
    retrieveOrCreateAccount: retrieveOrCreateAccount
};