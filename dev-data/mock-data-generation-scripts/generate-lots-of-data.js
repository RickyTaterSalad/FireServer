var accountGenerator = require("../generators/generate-accounts");
var conversationGenerator = require("../generators/generate-conversations");
var postGenerator = require("../generators/generate-post");
var messageGenerator = require("../generators/generate-messages");
var async = require("async");

var ACCOUNTS_TO_GENERATE = 40;
var POSTS_TO_GENERATE = 75;
var CONVERSATIONS_TO_GENERATE = 100;
var CONVERSATION_TO_GENERATE_RANDOM_MESSAGES_FOR = 75;


var createMockData = function (callback) {
    console.log("generate mock data");
    var fxns = [];
    fxns.push(accountGenerator.generateAccounts.bind(null, ACCOUNTS_TO_GENERATE));
    fxns.push(postGenerator.generatePosts.bind(null, POSTS_TO_GENERATE));
    fxns.push(conversationGenerator.generateConversations.bind(null, CONVERSATIONS_TO_GENERATE));
    fxns.push(messageGenerator.generateMessages.bind(null, CONVERSATION_TO_GENERATE_RANDOM_MESSAGES_FOR));
    async.series(fxns, function () {
        console.log("mock data complete");
        callback();
    });
};

module.exports = {
    createMockData: createMockData
};
