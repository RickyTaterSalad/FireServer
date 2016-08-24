var Account = require('mongoose').model('Account');
var Promise = require("bluebird");
var retrieveOrCreateAccount = function (username) {
    return new Promise(function (resolve, reject) {
        var params = {
            "localAuthUid": username
        };
        Account.findOne(params, function (err, user) {
            if (user == null) {
                console.log("Creating account");
                return createAccount(username).catch(function (e) {
                    console.log("got reject in retrieveOrCreateAccount");
                    reject(e);
                }).then(function (user) {
                    console.log("got account in retrieveOrCreateAccount");
                    resolve(user);
                })
            }
            else {
                console.log("found user in DB");
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
                if (user != null) {
                    console.dir(JSON.stringify(user));
                }
                if (err) {
                    console.log("Caught error in create google account");
                    console.log(err);
                }
                err ? reject(err) : resolve(user);
            }
        )
    });
};

module.exports = {
    retrieveOrCreateAccount: retrieveOrCreateAccount
};