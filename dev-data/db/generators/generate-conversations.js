var async = require("async");
var Conversation = require('mongoose').model('Conversation');

var postController = require("../../../controllers/post-controller");
var accountController = require("../../../controllers/account-controller");
var debug = require('debug')('fireServer:server');

var generateConversations = function (count, callback) {
    var fxns = [];
    for (var i = 0; i < count; i++) {
        fxns.push(generateConversation);
    }
    fxns.push(function () {
        callback();
    });
    async.series(fxns);

};
var generateConversation = function (callback) {
    postController.getRandom().then(function (randomPost) {
        accountController.getRandom().then(function (account) {
            if (!randomPost) {
                debug("could not retrieve random post to generateConversation");
                callback();
            }
            var conversation = new Conversation({
                creator: randomPost.creator,
                recipient: account._id,
                post: randomPost._id
            });
            var err = conversation.validateSync();
            if (err) {
                debug("generated invalid conversation");
                console.dir(err);
                callback();
            }
            else {

                conversation.save(function (err) {
                    if (err) {
                        debug("error creating conversation");
                        console.dir(err);
                    }
                    else {
                        debug("created conversation");

                    }
                    callback();
                });
            }
        });
    });
};
module.exports = {
    generateConversation: generateConversation,
    generateConversations: generateConversations
};