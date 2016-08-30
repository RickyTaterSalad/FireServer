//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Account = require('mongoose').model('Account');


var getRandom = function (butNotThis) {
    return controllerUtils.getRandomDocument(Account,butNotThis);
};
var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Account,id);
};

var findByGoogleProfile = function (profile) {
    return Account.findOne({
        googleUid: profile.id
    });


};
var findByFacebookProfile = function (profile) {
//todo
    return Account.findOne({
        facebookUid: profile.id
    });
};
//debug only
var findByLocalUsername = function (profile) {
    return Account.findOne({
        localAuthUid: profile.id
    });
};

var registerAccount = function (/*Account */ account, registrationParameters) {
//todo
};

var exports = {
    findById: findById,
    findByGoogleProfile: findByGoogleProfile,
    findByFacebookProfile: findByFacebookProfile,
    findByLocalUsername: findByLocalUsername,
    registerAccount: registerAccount
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}


module.exports = exports;