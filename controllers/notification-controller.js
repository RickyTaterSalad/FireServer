//model types passed can be either the instance itself or the object id
var controllerUtils = require("../util/controller-utils");
var Post = require('mongoose').model('Post');
var Message = require('mongoose').model('Message');
var async = require("async");

var notificationsForUser = function (/*ObjectId*/ account, /*Moment*/ timestamp) {
    if (!account || !timestamp) {
        return Promise.resolve([]);
    }
    var date = timestamp.toDate();
    console.log(date);
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
    return new Promise(function (resolve) {
        async.parallel([
                Post.find.bind(Post, postUpdateParams, "_id created shift"),
                Post.find.bind(Message, messageCreatedParams, "conversation")
            ],
            function (err, res) {
                if (err) {
                    console.log("err");
                    console.dir(err);
                }
                else {
                    console.log("RES");
                    console.dir(res);
                }
                var obj = {conversations: [],posts:[]};
                for(var i=0; i < res.length;i++){
                    if(res[i] && res[i].length > 0){
                        if(res[i][0].conversation){
                            obj.conversations = res[i];
                        }
                        else{
                            obj.posts = res[i];
                        }
                    }

                }
                resolve(obj);
            }
        )
    });
};

var exports = {
    notificationsForUser: notificationsForUser
};

module.exports = exports;