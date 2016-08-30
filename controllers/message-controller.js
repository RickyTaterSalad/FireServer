//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Message = require('mongoose').model('Message');


var getRandom = function () {
    return controllerUtils.getRandomDocument(Message);
};


var findById = function (/*ObjectId*/ id) {
    return controllerUtils.byId(Message,id);
};


var forConversation = function (/* ObjectId */ conversationId) {
    if(!conversationId){
        return Promise.resolve([]);
    }
    return Message.find({
        conversation: conversationId
    });
};



var exports = {
    findById: findById,
    forConversation: forConversation
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;