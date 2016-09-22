//model types passed can be either the instance itself or the object id
var mongoose = require('mongoose');
var controllerUtils = require("../util/controller-utils");
var Message = mongoose.model('Message');


var getRandom = function () {
    return controllerUtils.getRandomDocument(Message);
};


var findById = function (/*ObjectId*/ id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return controllerUtils.byId(Message,id);
};


var forConversation = function (/* ObjectId */ conversationId) {

    if(!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)){
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