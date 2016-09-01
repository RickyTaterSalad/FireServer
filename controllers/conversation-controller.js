//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Conversation = require('mongoose').model('Conversation');
var RequestHelperMethods = require("../util/request-helper-methods");
var debug = require('debug')('fireServer:server');

var getRandom = function () {
    return controllerUtils.getRandomDocument(Conversation, {populate: "post messages"});
};
var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Conversation, id).populate("post messages").exec();
};

var findByUser = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    var params = {
        $or: [{'creator': user._id}, {'recipient': user._id}]
    };
    return Conversation.find(params).populate("post messages").exec();
};
var findByCreator = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    return Conversation.find({
        'creator': user._id
    }).populate("post messages").exec();
};
var findByRecipient = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    return Conversation.find({
        'recipient': user._id
    }).populate("post messages").exec();
};
var addMessageToConversation = function (message) {
    if (!message || !message.conversation) {
        debug("invalid data send to addMessageToConversation");
        return Promise.resolve(false);
    }
    else {
        return Conversation.findByIdAndUpdate(message.conversation, {$push: {messages: message}}, {new: true}).exec();
    }
}

var conversationExistsForUserAndPost = function (/*ObjectId */ account, /*ObjectId*/ post) {
    if (!RequestHelperMethods.validObjectId(account) || RequestHelperMethods.validObjectId(post)) {
        Promise.resolve(true);
    }
    return Conversation.findOne({
        'creator': account,
        'post': post
    }).then(function (conversation) {
        return conversation != null;
    });
};


var exports = {
    findById: findById,
    findByUser: findByUser,
    findByCreator: findByCreator,
    findByRecipient: findByRecipient,
    addMessageToConversation: addMessageToConversation,
    conversationExistsForUserAndPost: conversationExistsForUserAndPost
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;