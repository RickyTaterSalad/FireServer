var Account = require('mongoose').model('Account');
var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');

var photoFromProfile = function (profile) {
    if (!profile || !profile.photos || profile.photos.length == 0) {
        return null;
    }
    return profile.photos[0].value;

};
var emailFromProfile = function (profile) {
    if (!profile || !profile.emails) {
        return null;
    }
    for (var i = 0; i < profile.emails.length; i++) {
        var email = profile.emails[i];
        if (email) {
            if (email.type == 'account') {
                return email.value;
            }
        }
    }
    if (profile.emails.length > 0) {
        return profile.emails[0].value;
    }
    return null;
};
var retrieveOrCreateAccount = function (profile) {
    return new Promise(function (resolve, reject) {
        var params = {
            "googleUid": profile.id
        };
        Account.findOne(params, function (err, user) {
            if (user == null) {
                debug("Creating account");
                return createAccount(profile).catch(function (e) {
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
var createAccount = function (profile) {
    return new Promise(function (resolve, reject) {
        //create
        var params = {
            googleUid: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: emailFromProfile(profile),
            photo: photoFromProfile(profile)
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
    emailFromProfile: emailFromProfile,
    photoFromProfile: photoFromProfile,
    retrieveOrCreateAccount: retrieveOrCreateAccount
};