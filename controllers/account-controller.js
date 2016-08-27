//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Account = require('mongoose').model('Account');


var createRandom = function(){

};
var getRandom = function (butNotThis) {
    return controllerUtils.getRandomDocument(Account,butNotThis);
};
var findById = function (/*ObjectId*/ id) {

};

var findByGoogleProfile = function (profile) {

};
var findByFacebookProfile = function (profile) {

};
//debug only
var findByLocalUsername = function (profile) {

};

var createAccount = function (/*Account */ account) {

};
var registerAccount = function (/*Account */ account, registrationParameters) {

};

var exports = {
    findById: findById,
    findByGoogleProfile: findByGoogleProfile,
    findByFacebookProfile: findByFacebookProfile,
    findByLocalUsername: findByLocalUsername,
    createAccount: createAccount,
    registerAccount: registerAccount
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
    exports.createRandom = createRandom;
}


module.exports = exports;