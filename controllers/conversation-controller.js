//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var Post = mongoose.model('Post');
var Account = mongoose.model('Account');
var Message = mongoose.model('Message');
var debug = require('debug')('fireServer:server');
var async = require("async");

var getRandom = function () {
    return controllerUtils.getRandomDocument(Conversation);
};
var findById = function (/*ObjectId*/ id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return controllerUtils.byId(Conversation, id).exec();
};

var findByUser = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    var params = {
        $or: [{'creator': user._id}, {'recipient': user._id}],
        archived: false
    };
    return Conversation.find(params).populate("creator  messages recipient post").exec();
};
var findByUserAndPostId = function (/*ObjectId*/ userId, /*ObjectId */ postId) {
    if (!userId || !postId || !mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return Promise.resolve([]);
    }
    var params = {
        $or: [{'creator': userId}, {'recipient': userId}],
        post: postId,
        archived: false
    };
    return Conversation.find(params).populate("creator messages recipient").exec();
};
var archiveConversationsForPosts = function (/*Array<ObjectId>*/ postIds) {
    if (!postIds || !postIds.length) {
        return Promise.resolve(null);
    }
    for (var i = 0; i < postIds.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(postIds[i])) {
            return Promise.resolve([]);
        }
    }
    return Conversation.update({
        archived: false,
        post: {$in: postIds}
    }, {archived: true}, {multi: true});
};

var findByCreator = function (/*Account*/ user, populateChildren) {
    if (!user) {
        return Promise.resolve([]);
    }
    if (populateChildren) {
        return Conversation.find({
            'creator': user._id,
            archived: false
        }).populate("post messages").exec();
    }
    else {
        return Conversation.find({
            'creator': user._id,
            archived: false
        }).exec();
    }
};
var findByRecipient = function (/*Account*/ user) {
    if (!user) {
        return Promise.resolve([]);
    }
    return Conversation.find({
        recipient: user._id,
        archived: false
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
};

var conversationExistsForUserAndPost = function (/*ObjectId */ account, /*ObjectId*/ post) {
    if (!mongoose.Types.ObjectId.isValid(account) || !mongoose.Types.ObjectId.isValid(post)) {
        return Promise.resolve(true);
    }
    return Conversation.findOne({
        creator: account,
        post: post,
        archived: false
    }).then(function (conversation) {
        return conversation != null;
    });
};
var conversationsForUserAndPosts = function (/*Account*/ user, /*Array<ObjectId>*/ conversations, options) {
    if (!user || !conversations) {
        return Promise.resolve([]);
    }
    var params = {
        $or: [
            {recipient: user._id},
            {creator: user._id}
        ],
        messages: {$exists: true, $not: {$size: 0}},
        post: {$in: conversations},
        archived: false

    };
    return Conversation.find(params).select("-creator -recipient -messages").then(function (res) {
        var obj = {};
        for (var i = 0; i < res.length; i++) {
            if (!obj[res[i].post]) {
                obj[res[i].post] = [];
            }
            obj[res[i].post].push(res[i]._id);
        }
        return obj;
    });
};
var create = function (/*Conversation */ conversation) {
    if (!conversation || !conversation.recipient || !conversation.creator) {
        return Promise.reject({error: true, message: "Bad Request"});
    }
    var accountFindParams = {
        _id: {$in: [conversation.recipient, conversation.creator]}
    };

    var updateAccounts = function (accounts, conversation, callback) {
        Account.update({_id: {$in: [accounts[0]._id, accounts[1]._id]}},
            {$push: {conversations: conversation._id}},
            {multi: true}
            , callback);
    };
    var createConversation = function (accounts, callback) {
        conversation.save(function (err, res) {
            callback(err, accounts, res);
        });
    };
    return new Promise(function (resolve, reject) {
        async.waterfall([
            Account.find.bind(Account, accountFindParams),
            function (accounts, callback) {
                if (!accounts || accounts.length != 2) {
                    return callback(Error("Could not find accounts"));
                }
                callback(null, accounts);
            },
            createConversation,
            updateAccounts

        ], function (err, results) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(results);
            }
        });
    })

};

var exports = {
    findById: findById,
    findByUser: findByUser,
    findByCreator: findByCreator,
    findByRecipient: findByRecipient,
    addMessageToConversation: addMessageToConversation,
    conversationsForUserAndPosts: conversationsForUserAndPosts,
    conversationExistsForUserAndPost: conversationExistsForUserAndPost,
    archiveConversationsForPosts: archiveConversationsForPosts,
    findByUserAndPostId: findByUserAndPostId,
    create: create
};
if (process.env.NODE_ENV !== 'production') {
    exports.getRandom = getRandom;
}

module.exports = exports;