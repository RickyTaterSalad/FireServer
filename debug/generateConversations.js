var mongoose = require("mongoose");
var Promise = require("bluebird");
var async = require('async');

var mongooseHelper = require("../helpers/mongoose-helper").initialize();
var Account = mongoose.model('Account');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');
var Post = mongoose.model('Post');

var createMessage = function (senderId, recipientId, conversationId, messageContent) {
    return new Promise(function (resolve, reject) {
        var msg = {
            content: messageContent,
            sender: senderId,
            recipient: recipientId,
            conversation: conversationId
        };
        Message.create(msg, function (err, message) {
            if (!err) {
                console.log("created message: " + JSON.stringify(message));
            }

            err ? reject(err) : resolve(message);

        });
    });
};

var createConversation = function (creatorId, recipientId, postId) {
    return new Promise(function (resolve, reject) {
        var conv = {
            creator: creatorId,
            recipient: recipientId,
            post: postId
        };
        Conversation.create(conv, function (err, conversation) {
            if (!err) {
                console.log("created conversation: " + JSON.stringify(conversation));
            }

            err ? reject(err) : resolve(conversation);
        });
    });
};
var generateConversation = function (userId1, userId2, postId) {
    return new Promise(function (resolve, reject) {
        var msgs = [];
        createConversation(userId1, userId2, postId).catch(function (err) {
        }).then(function (conversation) {
            createMessage(userId1, userId2, conversation._id, "Nope nope nope").then(function (msg1) {
                msgs.push(msg1);
                createMessage(userId2, userId1, conversation._id, "Yes Yes Yes").then(function (msg2) {
                    msgs.push(msg2);
                    createMessage(userId1, userId2, conversation._id, "OK then").then(function (msg3) {
                        msgs.push(msg3);
                        createMessage(userId2, userId1, conversation._id, "Very Well").then(function (msg4) {
                            msgs.push(msg4);
                            Conversation.findByIdAndUpdate(conversation._id, {
                                $addToSet: {"messages": {$each: msgs}}
                            }, null, function (err, updateResult) {
                                console.dir("Update Conversation messages result: " + JSON.stringify((updateResult)));
                                resolve();
                            });
                        })
                    })
                });
            });
        });
    });
};
var createConversations = function () {
    return new Promise(function (resolve, reject) {
        Post.findOne({}, function (err, post) {
            if (err || !post) {
                console.log("could not find a post to create a conversation from");
                reject();
            }
            var user1 = post.creator;
            var user2 = null;
            var user1IdString = user1.toString();
            Account.find({}, function (err, accounts) {
                if (accounts && accounts.length > 1) {
                    for (var i = 0; i < accounts.length; i++) {
                        var accountIdAsString = accounts[i]._id.toString();
                        if (accountIdAsString != user1IdString) {
                            console.log("found second account: " + user1IdString + " != " + accountIdAsString);
                            user2 = accounts[i]._id;
                            break;
                        }
                    }
                    if (user1 && user2) {
                        console.log("creating conversation");
                        generateConversation(user1, user2, post._id).then(function () {
                            console.log("complete");
                            resolve();
                        })
                    }
                }
                else {
                    console.log("could not find accounts to create conversations with");
                    reject();
                }
            });
        });
    });
};
module.exports = {
    createConversations: createConversations
};

