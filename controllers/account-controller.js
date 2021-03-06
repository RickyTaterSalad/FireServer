//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');
var controllerUtils = require("../util/controller-utils");
var Account = mongoose.model('Account');

var stationController = require("../controllers/station-controller");
var assignHireController = require("../controllers/assign-hire-controller");

//remove after dev
var getFireUser = function () {
    return Account.findOne({
        email: "fire@fire.com"
    });
};

var getRandom = function (butNotThis) {
    return controllerUtils.getRandomDocument(Account, butNotThis);
};
var findById = function (/*ObjectId*/ id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return controllerUtils.byId(Account, id);
};

var findByGoogleProfile = function (profile) {
    if (!profile) {
        return Promise.resolve(null);
    }
    return Account.findOne({
        googleUid: profile.id
    });


};
var findByFacebookProfile = function (profile) {
//todo
    if (!profile) {
        return Promise.resolve(null);
    }
    return Account.findOne({
        facebookUid: profile.id
    });
};
//debug only
var findByLocalUsername = function (profile) {
    if (!profile) {
        return Promise.resolve(null);
    }
    return Account.findOne({
        localAuthUid: profile.id
    });
};
var permaBanUser = function (account) {
    if (!account) {
        return Promise.resolve(false);
    }
    account.update({isPermaBanned: true}).then(function (err) {
        return !error;
    })
};
var softBanUser = function (account) {

    if (!account) {
        return Promise.resolve(false);
    }
    account.update({isSoftBanned: true}).then(function (err) {
        return !error;
    })
};

var registerAccount = function (/*ObjectId*/ userId, /*registerParams */ registrationParams) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !registrationParams ||
        !mongoose.Types.ObjectId.isValid(registrationParams.station) ||
        !mongoose.Types.ObjectId.isValid(registrationParams.assignHireCode)) {
        return Promise.resolve(null);
    }
    console.dir(userId);
    console.dir(registrationParams);

    return stationController.findById(registrationParams.station).then(function(station){
        if(!station){
            console.log("invalid station");
            return null;
        }
        return assignHireController.findById(registrationParams.assignHireCode).then(function(ahCode) {
            if(!ahCode){
                console.log("invalid ah code");
                return null;
            }
            return Account.findByIdAndUpdate(
                userId, //query criteria
                registrationParams,
                {new: true}   //get back new account doc
            );
        });
    });
};

var exports = {
    findById: findById,
    findByGoogleProfile: findByGoogleProfile,
    findByFacebookProfile: findByFacebookProfile,
    findByLocalUsername: findByLocalUsername,
    registerAccount: registerAccount,
    getFireUser: getFireUser
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}


module.exports = exports;
