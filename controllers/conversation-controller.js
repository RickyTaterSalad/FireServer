//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Conversation = require('mongoose').model('Conversation');


var getRandom = function () {
    return controllerUtils.getRandomDocument(Conversation);
};


var findById = function (/*ObjectId*/ id) {

};

var findByAccount = function (/*Account*/ user) {

};
var findByCreator = function (/*Account*/ user) {

};
var findByRecipient = function (/*Account*/ user) {

};

var exports = {
    findById: findById,
    findByAccount: findByAccount,
    findByCreator: findByCreator,
    findByRecipient: findByRecipient
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;