//model types passed can be either the instance itself or the object id
var Post = require('mongoose').model('Post');
var Message = require('mongoose').model('Message');
var async = require("async");

var notificationsForUser = function (/*ObjectId*/ account, /*Moment*/ timestamp) {
    if (!account || !timestamp) {
        return Promise.resolve([]);
    }
    var date = timestamp.toDate();
    var postUpdateParams = {
        creator: account,
        updatedAt: {
            $gt: date
        }
    };

    var messageCreatedParams = {
        recipient: account,
        createdAt: {$gt: date}
    };
    var findMessages = function (callback) {
        Message.find(messageCreatedParams).populate("conversation sender").exec(function(err,res){
            callback(err,res);
        });
    };
    return new Promise(function (resolve) {
        async.series([
                Post.find.bind(Post, postUpdateParams, "_id created shift"),
                findMessages
            ],
            function (err, res) {

                if (err) {
                }
                else {
                }

                var obj = {messages: res.length > 1 ? res[1] : [], posts: res.length > 0 ? res[0] : []};
                resolve(obj);
            }
        )
    });
};

var exports = {
    notificationsForUser: notificationsForUser
};

module.exports = exports;