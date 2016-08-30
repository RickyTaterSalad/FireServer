//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Conversation = require('mongoose').model('Conversation');


var getRandom = function () {
    return controllerUtils.getRandomDocument(Conversation);
};


var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Conversation, id);
};

var findByUser = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    var params = {
        $or: [{'creator': user._id}, {'recipient': user._id}]
    };
    return Conversation.find(params);
};
var findByCreator = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    return Conversation.find({
        'creator': user._id
    });
};
var findByRecipient = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    return Conversation.find({
        'recipient': user._id
    });
};

var exports = {
    findById: findById,
    findByUser: findByUser,
    findByCreator: findByCreator,
    findByRecipient: findByRecipient
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;