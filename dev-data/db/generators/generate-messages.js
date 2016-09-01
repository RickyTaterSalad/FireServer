var async = require("async");
var faker = require("faker");
var Message = require('mongoose').model('Message');
var conversationController = require("../../../controllers/conversation-controller");
var debug = require('debug')('fireServer:server');
var generateMessages = function (conversationCount,maxMessagesPerConversation, callback) {
    var fxns = [];
    for (var i = 0; i < conversationCount; i++) {
        fxns.push(generateMessage.bind(null, Math.floor(Math.random() * maxMessagesPerConversation) + 1));
    }
    fxns.push(function () {
        callback();
    });
    async.series(fxns);

};
var generateMessage = function (msgCount,callback) {
    conversationController.getRandom().then(function (conversation) {
        if (!conversation) {
            debug("could not retrieve random conversation to generateMessage");
            callback();
        }
        debug("creating conversations for post: " + conversation._id);

        var message = new Message({
            content: faker.lorem.sentence(),
            conversation: conversation._id
        });
        if (faker.random.boolean()) {
            message.sender = conversation.creator;
            message.recipient = conversation.post.creator;
        }
        else {
            message.sender = conversation.post.creator;
            message.recipient = conversation.creator;
        }
        var err = message.validateSync();
        if(err){
            console.dir(message);
            debug("generated invalid message");
            callback();
        }
        else {
            message.save(function (err) {
                if (err) {
                    debug("error creating message");
                    debug(err);
                    callback();

                }
                else {
                    debug("created message");
                    //add message to conversation
                    conversationController.addMessageToConversation(message).then(function(){callback()});
                }
            });
        }
    });
};
module.exports = {
    generateMessages: generateMessages,
    generateMessage: generateMessage
};