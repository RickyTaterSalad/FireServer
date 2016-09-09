var accountGenerator = require("../generators/generate-accounts");
var conversationGenerator = require("../generators/generate-conversations");
var postGenerator = require("../generators/generate-post");
var messageGenerator = require("../generators/generate-messages");
var async = require("async");
var debug = require('debug')('fireServer:server');
var ACCOUNTS_TO_GENERATE = 10;
var POSTS_TO_GENERATE = 50;
var CONVERSATIONS_TO_GENERATE = 30;
var CONVERSATION_TO_GENERATE_RANDOM_MESSAGES_FOR = 20;
var MAX_MESSAGES_PER_CONVERSATION_TO_GENERATE = 5;

var createMockData = function (callback) {
    debug("generate mock data");
    var fxns = [];
    fxns.push(accountGenerator.generateAccounts.bind(null, ACCOUNTS_TO_GENERATE));
    fxns.push(postGenerator.generatePosts.bind(null, POSTS_TO_GENERATE));
    fxns.push(conversationGenerator.generateConversations.bind(null, CONVERSATIONS_TO_GENERATE));
    fxns.push(messageGenerator.generateMessages.bind(null, CONVERSATION_TO_GENERATE_RANDOM_MESSAGES_FOR, MAX_MESSAGES_PER_CONVERSATION_TO_GENERATE));
    async.series(fxns, function () {
        debug("mock data complete");
        callback();
    });
};

module.exports = {
    createMockData: createMockData
};
