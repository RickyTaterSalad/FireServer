var async = require("async");
var faker = require("faker");
var Message = require('mongoose').model('Message');
var conversationController = require("../../../controllers/conversation-controller");

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
            console.log("could not retrieve random conversation to generateMessage");
            callback();
        }
        console.log("creating conversations for post: " + conversation._id);

        var message = new Message({
            content: faker.lorem.sentence(),
            conversation: conversation._id
        });
        if (faker.random.boolean()) {
            message.sender = conversation.creator;
            message.recipient = conversation.recipient;
        }
        else {
            message.sender = conversation.recipient;
            message.recipient = conversation.creator;
        }
        var err = message.validateSync();
        if(err){
            console.log("generated invalid message");
            callback();
        }
        else {
            message.save(function (err) {
                if (err) {
                    console.log("error creating message");
                    console.dir(err);
                    callback();

                }
                else {
                    console.log("created message");
                    //add message to converstation
                    conversation.update({ $push: { messages: message }},callback);
                }
            });
        }
    });
};
module.exports = {
    generateMessages: generateMessages,
    generateMessage: generateMessage
};