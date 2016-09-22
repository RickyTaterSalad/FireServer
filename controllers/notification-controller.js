//model types passed can be either the instance itself or the object id
var mongoose =  require('mongoose');
var Post = mongoose.model('Post');
var Message = mongoose.model('Message');
var async = require("async");

var notificationsForUser = function (/*ObjectId*/ account, /*Moment*/ timestamp) {
    if (!account || !timestamp || !mongoose.Types.ObjectId.isValid(account)) {
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