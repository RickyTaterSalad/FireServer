var schedule = require('node-schedule');
var async = require("async");
var debug = require('debug')('fireServer:server');
var postController = require("../controllers/post-controller");
var conversationController = require("../controllers/conversation-controller");
var postCountCacheController = require("../cache/post-count-cache-controller");
var dateUtils = require("./date-utils");
var util = require("util");

var initialized = false;

var flushCache= function(callback){
    postCountCacheController.flush(callback);
};

var archiveConversations = function (archivePostIds, callback) {
    debug(util.format("Archiving conversations for %s posts", archivePostIds.length));
    conversationController.archiveConversationsForPosts(archivePostIds).then(function(result){
        debug("Archive conversation response");
        debug(result);
        callback(null,result);
    })
};
var archivePosts = function (callback) {
    var date = dateUtils.todayUtc();
    date.minute(0);
    date.second(0);
    date.hour(0);
    date.millisecond(0);
    debug(util.format("archiving posts older than %s",date.valueOf()));
    postController.allBeforeDateThatAreNotArchived(date).then(function (conversations) {
        var conversationIds = [];
        for (var i = 0; i < conversations.length; i++) {
            conversationIds.push(conversations[i]._id);
        }
        debug(util.format("Found %s posts to archive", conversationIds.length));
        //archive all posts
        postController.archiveBeforeDate(date).then(function(result){
            debug("Archive Post Response");
            debug(result);
            callback(null,conversationIds);

        });
    })
};

var initialize = function () {
    if (!initialized) {
        debug("Scheduling DB Archiver");
        //run at 3am every morning
        var j = schedule.scheduleJob('0 2 * * *', function () {
            debug("**********ARCHIVING OLD POSTS AND CONVERSATIONS**********");
            async.waterfall([
                archivePosts,
                archiveConversations,
                flushCache
            ], function () {
                debug("DB Cleanup Complete");
            });
        });
        initialized = true;
    }
};

module.exports = {
    initialize: initialize
};