//model types passed can be either the instance itself or the object id

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

module.exports = {
    findById: findById,
    findByGoogleProfile: findByGoogleProfile,
    findByFacebookProfile: findByFacebookProfile,
    findByLocalUsername: findByLocalUsername,
    createAccount: createAccount,
    registerAccount: registerAccount
};